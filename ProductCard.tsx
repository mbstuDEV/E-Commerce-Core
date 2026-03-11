import { NextRequest, NextResponse } from "next/server";
import { constructWebhookEvent } from "@/lib/stripe";
import { deleteCart } from "@/lib/redis";
import { db } from "@/lib/db";
import type Stripe from "stripe";

export const config = { api: { bodyParser: false } };

// ─── POST /api/webhooks/stripe ────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = constructWebhookEvent(payload, sig);
  } catch (err) {
    console.error("[Webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutComplete(event.data.object as Stripe.Checkout.Session);
        break;
      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      case "charge.refunded":
        await handleRefund(event.data.object as Stripe.Charge);
        break;
      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error(`[Webhook] Handler error for ${event.type}:`, err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// ─── Handlers ─────────────────────────────────────────────────────────────────

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  if (!userId) throw new Error("Missing userId in session metadata");

  const lineItems = session.line_items?.data ?? [];

  await db.order.create({
    data: {
      userId,
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent as string,
      status: "PROCESSING",
      subtotal: (session.amount_subtotal ?? 0) / 100,
      tax: (session.total_details?.amount_tax ?? 0) / 100,
      shipping: (session.total_details?.amount_shipping ?? 0) / 100,
      total: (session.amount_total ?? 0) / 100,
      items: {
        create: lineItems.map((li) => ({
          productId: li.price?.product_data?.metadata?.productId ?? "",
          variantId: li.price?.product_data?.metadata?.variantId ?? "",
          name: li.description ?? "",
          price: (li.amount_total ?? 0) / 100 / (li.quantity ?? 1),
          quantity: li.quantity ?? 1,
          image: "",
        })),
      },
    },
  });

  // Clear the cart after successful payment
  await deleteCart(userId);
}

async function handlePaymentFailed(intent: Stripe.PaymentIntent) {
  const userId = intent.metadata?.userId;
  if (!userId) return;

  await db.order.updateMany({
    where: { stripePaymentIntentId: intent.id },
    data: { status: "CANCELLED" },
  });
}

async function handleRefund(charge: Stripe.Charge) {
  const paymentIntentId =
    typeof charge.payment_intent === "string" ? charge.payment_intent : null;
  if (!paymentIntentId) return;

  await db.order.updateMany({
    where: { stripePaymentIntentId: paymentIntentId },
    data: { status: "REFUNDED" },
  });
}
