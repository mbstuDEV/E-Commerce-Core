"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CartSummary } from "@/components/cart/CartSummary";
import type { Cart } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/cart")
      .then((r) => r.json())
      .then(setCart);
  }, []);

  async function handleCheckout() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Checkout failed");

      router.push(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  if (!cart) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
      </div>
    );
  }

  if (cart.itemCount === 0) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-neutral-900">
          Your cart is empty
        </h1>
        <p className="mt-2 text-neutral-500">
          Add some products before checking out.
        </p>
        <a
          href="/products"
          className="mt-6 inline-block rounded-lg bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-700"
        >
          Continue shopping
        </a>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-neutral-900">
        Checkout
      </h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
        {/* Cart summary */}
        <div className="lg:col-span-3">
          <CartSummary items={cart.items} editable />
        </div>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
            <h2 className="text-lg font-semibold text-neutral-900">
              Order summary
            </h2>

            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-neutral-500">Subtotal</dt>
                <dd className="font-medium text-neutral-900">
                  ${cart.subtotal.toFixed(2)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Shipping</dt>
                <dd className="font-medium text-neutral-900">
                  Calculated at next step
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Tax</dt>
                <dd className="font-medium text-neutral-900">
                  Calculated at next step
                </dd>
              </div>
              <div className="border-t border-neutral-200 pt-3 flex justify-between">
                <dt className="font-semibold text-neutral-900">Total</dt>
                <dd className="font-bold text-neutral-900 text-base">
                  ${cart.subtotal.toFixed(2)}
                </dd>
              </div>
            </dl>

            {error && (
              <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-neutral-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-700 disabled:opacity-50"
            >
              {loading ? "Redirecting to payment…" : "Proceed to payment"}
            </button>

            <p className="mt-3 text-center text-xs text-neutral-400">
              Secured by Stripe · PCI DSS compliant
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
