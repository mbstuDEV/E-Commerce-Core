"use client";

/**
 * app/(storefront)/demo/page.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * A self-contained interactive demo page. Shows the product catalogue, lets
 * visitors browse / filter / add items to a local cart, and previews the
 * checkout summary — all without touching a real database, Stripe, or Auth0.
 *
 * Enabled only when NEXT_PUBLIC_DEMO_MODE=true (or by visiting /demo directly).
 */

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

// ─── Types (local, avoids import issues in standalone demo) ───────────────────

interface Variant  { id: string; price: number; inventory: number; options: Record<string, string> }
interface Product  { id: string; slug: string; name: string; description: string; images: string[]; category: string; tags: string[]; featured: boolean; variants: Variant[] }
interface CartItem { productId: string; variantId: string; quantity: number; price: number; name: string; image: string; options: Record<string, string> }

// ─── Component ────────────────────────────────────────────────────────────────

export default function DemoPage() {
  const [products,  setProducts]  = useState<Product[]>([]);
  const [category,  setCategory]  = useState("All");
  const [categories, setCategories] = useState<string[]>([]);
  const [cart,      setCart]      = useState<CartItem[]>([]);
  const [cartOpen,  setCartOpen]  = useState(false);
  const [loading,   setLoading]   = useState(true);
  const [added,     setAdded]     = useState<string | null>(null);

  // Fetch products + categories
  useEffect(() => {
    Promise.all([
      fetch("/api/demo?resource=products").then((r) => r.json()),
      fetch("/api/demo?resource=categories").then((r) => r.json()),
    ]).then(([p, c]) => {
      setProducts(p.data ?? []);
      setCategories(["All", ...(c.data ?? [])]);
      setLoading(false);
    });
  }, []);

  const filtered = category === "All"
    ? products
    : products.filter((p) => p.category === category);

  const addToCart = useCallback((product: Product) => {
    const variant = product.variants.find((v) => v.inventory > 0);
    if (!variant) return;

    setCart((prev) => {
      const existing = prev.find((i) => i.variantId === variant.id);
      if (existing) {
        return prev.map((i) =>
          i.variantId === variant.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          variantId: variant.id,
          quantity: 1,
          price: variant.price,
          name: product.name,
          image: product.images[0] ?? "",
          options: variant.options,
        },
      ];
    });

    setAdded(product.id);
    setTimeout(() => setAdded(null), 1500);
  }, []);

  const updateQty = (variantId: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.variantId !== variantId));
    } else {
      setCart((prev) =>
        prev.map((i) => (i.variantId === variantId ? { ...i, quantity: qty } : i))
      );
    }
  };

  const subtotal  = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-neutral-900">
              E-Commerce Core
            </span>
            <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-700">
              DEMO
            </span>
          </div>

          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-700 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Cart
            {itemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="border-b border-neutral-100 bg-neutral-50 px-4 py-16 text-center sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-violet-600">
          Interactive Demo
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
          Browse the store
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-neutral-500">
          Everything here runs off fixture data — no database, Stripe, or Auth0
          required. A fully functional preview of the storefront.
        </p>
      </section>

      {/* ── Category filter ───────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                category === cat
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-300 text-neutral-600 hover:border-neutral-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Product grid ─────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-2xl bg-neutral-100" />
                <div className="mt-3 h-4 w-3/4 rounded bg-neutral-100" />
                <div className="mt-2 h-3 w-1/3 rounded bg-neutral-100" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((product) => {
              const price   = product.variants[0]?.price ?? 0;
              const inStock = product.variants.some((v) => v.inventory > 0);
              const isAdded = added === product.id;

              return (
                <div
                  key={product.id}
                  className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:shadow-lg"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-neutral-100">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-neutral-300 text-sm">
                        No image
                      </div>
                    )}
                    {product.featured && (
                      <span className="absolute left-2 top-2 rounded-full bg-neutral-900 px-2 py-0.5 text-xs font-semibold text-white">
                        Featured
                      </span>
                    )}
                    {!inStock && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                        <span className="text-xs font-semibold text-neutral-500">Out of stock</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <p className="truncate text-sm font-semibold text-neutral-900">
                      {product.name}
                    </p>
                    <p className="mt-0.5 text-sm text-neutral-500">${price.toFixed(2)}</p>

                    <button
                      onClick={() => addToCart(product)}
                      disabled={!inStock}
                      className={`mt-3 w-full rounded-lg py-2 text-xs font-semibold transition ${
                        isAdded
                          ? "bg-green-600 text-white"
                          : inStock
                          ? "bg-neutral-900 text-white hover:bg-neutral-700"
                          : "cursor-not-allowed bg-neutral-100 text-neutral-400"
                      }`}
                    >
                      {isAdded ? "✓ Added" : inStock ? "Add to cart" : "Sold out"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── Cart drawer ───────────────────────────────────────────────────── */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="flex-1 bg-black/40"
            onClick={() => setCartOpen(false)}
          />

          {/* Drawer */}
          <aside className="flex w-full max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
              <h2 className="text-base font-bold text-neutral-900">
                Cart ({itemCount})
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100"
              >
                ✕
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {cart.length === 0 ? (
                <p className="text-sm text-neutral-400 mt-8 text-center">
                  Your cart is empty.
                </p>
              ) : (
                <ul className="space-y-4">
                  {cart.map((item) => (
                    <li key={item.variantId} className="flex gap-3">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col gap-1">
                        <p className="text-sm font-medium text-neutral-900">
                          {item.name}
                        </p>
                        <p className="text-xs text-neutral-400">
                          {Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center rounded-lg border border-neutral-200 text-xs">
                            <button
                              onClick={() => updateQty(item.variantId, item.quantity - 1)}
                              className="px-2 py-1 text-neutral-500 hover:text-neutral-900"
                            >−</button>
                            <span className="px-2">{item.quantity}</span>
                            <button
                              onClick={() => updateQty(item.variantId, item.quantity + 1)}
                              className="px-2 py-1 text-neutral-500 hover:text-neutral-900"
                            >+</button>
                          </div>
                          <span className="text-sm font-semibold text-neutral-700">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Summary */}
            {cart.length > 0 && (
              <div className="border-t border-neutral-200 px-5 py-5">
                <div className="flex justify-between text-sm font-semibold text-neutral-900 mb-4">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <button
                  disabled
                  className="w-full rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white opacity-60 cursor-not-allowed"
                  title="Stripe checkout disabled in demo mode"
                >
                  Checkout (demo only)
                </button>
                <p className="mt-2 text-center text-xs text-neutral-400">
                  Payment is disabled in demo mode
                </p>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
