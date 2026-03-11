import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Order Confirmed" };

export default function CheckoutSuccessPage() {
  return (
    <main className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      {/* Icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-neutral-900">
        Order confirmed!
      </h1>
      <p className="mt-3 text-base text-neutral-500">
        Thanks for your purchase. You&apos;ll receive a confirmation email
        shortly with your order details.
      </p>

      <div className="mt-8 flex gap-3">
        <Link
          href="/products"
          className="rounded-xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-700"
        >
          Continue shopping
        </Link>
        <Link
          href="/account/orders"
          className="rounded-xl border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
        >
          View orders
        </Link>
      </div>
    </main>
  );
}
