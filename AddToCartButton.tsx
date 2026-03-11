import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getCart } from "@/lib/redis";
import { createCheckoutSession } from "@/lib/stripe";
import { rateLimit } from "@/lib/redis";

// ─── POST /api/checkout ───────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Rate-limit: 10 checkout attempts per user per 10 minutes
  const { allowed } = await rateLimit(
    `checkout:${user.id}`,
    10,
    600
  );
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      { status: 429 }
    );
  }

  const items = await getCart(user.id);
  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const origin = req.headers.get("origin") ?? "http://localhost:3000";

  const session = await createCheckoutSession({
    items,
    userId: user.id,
    successUrl: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${origin}/checkout`,
  });

  return NextResponse.json({ url: session.url });
}
