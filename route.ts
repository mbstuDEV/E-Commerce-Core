/**
 * app/api/demo/route.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * A single endpoint that serves all demo data — products, orders, cart, users.
 * No database, Redis, Stripe, or Auth0 required.
 *
 * Usage:
 *   GET /api/demo?resource=products
 *   GET /api/demo?resource=products&category=Tech&featured=true
 *   GET /api/demo?resource=orders
 *   GET /api/demo?resource=cart
 *   GET /api/demo?resource=users
 *
 * Enabled only when NEXT_PUBLIC_DEMO_MODE=true
 */

import { NextRequest, NextResponse } from "next/server";
import {
  DEMO_PRODUCTS,
  DEMO_ORDERS,
  DEMO_CART_ITEMS,
  DEMO_USERS,
} from "@/demo/fixtures";

function demoOnly() {
  return NextResponse.json(
    { error: "Demo mode is not enabled. Set NEXT_PUBLIC_DEMO_MODE=true." },
    { status: 403 }
  );
}

export async function GET(req: NextRequest) {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== "true") return demoOnly();

  const { searchParams } = new URL(req.url);
  const resource = searchParams.get("resource");

  switch (resource) {
    // ── Products ─────────────────────────────────────────────────────────────
    case "products": {
      const category = searchParams.get("category");
      const tag      = searchParams.get("tag");
      const featured = searchParams.get("featured");
      const q        = searchParams.get("q")?.toLowerCase();
      const page     = Math.max(1, Number(searchParams.get("page") ?? 1));
      const pageSize = Math.min(50, Number(searchParams.get("pageSize") ?? 12));

      let results = [...DEMO_PRODUCTS];

      if (category) results = results.filter((p) => p.category === category);
      if (tag)      results = results.filter((p) => p.tags.includes(tag));
      if (featured === "true") results = results.filter((p) => p.featured);
      if (q) {
        results = results.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        );
      }

      const total   = results.length;
      const data    = results.slice((page - 1) * pageSize, page * pageSize);
      const hasMore = page * pageSize < total;

      return NextResponse.json({ data, total, page, pageSize, hasMore });
    }

    // ── Single product by slug ────────────────────────────────────────────────
    case "product": {
      const slug = searchParams.get("slug");
      const product = DEMO_PRODUCTS.find((p) => p.slug === slug);
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json(product);
    }

    // ── Orders ────────────────────────────────────────────────────────────────
    case "orders": {
      const userId = searchParams.get("userId");
      const orders = userId
        ? DEMO_ORDERS.filter((o) => o.userId === userId)
        : DEMO_ORDERS;

      return NextResponse.json({
        data: orders,
        total: orders.length,
        page: 1,
        pageSize: orders.length,
        hasMore: false,
      });
    }

    // ── Cart ──────────────────────────────────────────────────────────────────
    case "cart": {
      const subtotal  = DEMO_CART_ITEMS.reduce((s, i) => s + i.price * i.quantity, 0);
      const itemCount = DEMO_CART_ITEMS.reduce((s, i) => s + i.quantity, 0);
      return NextResponse.json({ items: DEMO_CART_ITEMS, subtotal, itemCount });
    }

    // ── Users ─────────────────────────────────────────────────────────────────
    case "users": {
      const safe = DEMO_USERS.map(({ passwordHash: _pw, ...u }) => u);
      return NextResponse.json({ data: safe });
    }

    // ── Categories ────────────────────────────────────────────────────────────
    case "categories": {
      const cats = Array.from(new Set(DEMO_PRODUCTS.map((p) => p.category)));
      return NextResponse.json({ data: cats });
    }

    // ── Stats (admin dashboard) ───────────────────────────────────────────────
    case "stats": {
      const revenue      = DEMO_ORDERS.reduce((s, o) => s + o.total, 0);
      const orderCount   = DEMO_ORDERS.length;
      const productCount = DEMO_PRODUCTS.length;
      const lowStock     = DEMO_PRODUCTS.flatMap((p) => p.variants).filter(
        (v) => v.inventory <= 5
      ).length;

      return NextResponse.json({
        revenue: Math.round(revenue * 100) / 100,
        orderCount,
        productCount,
        lowStock,
        recentOrders: DEMO_ORDERS.slice(-3).reverse(),
      });
    }

    default:
      return NextResponse.json(
        {
          error: "Unknown resource. Valid values: products, product, orders, cart, users, categories, stats",
        },
        { status: 400 }
      );
  }
}
