/**
 * prisma/seed.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Populates the database with demo data.
 *
 * Run with:
 *   npx prisma db seed
 *
 * Or directly:
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
 *
 * The script is idempotent — safe to run multiple times.
 */

import { PrismaClient } from "@prisma/client";
import { DEMO_USERS, DEMO_PRODUCTS, DEMO_ORDERS } from "../demo/fixtures";

const db = new PrismaClient();

async function main() {
  console.log("🌱  Seeding database…\n");

  // ── Users ──────────────────────────────────────────────────────────────────
  console.log("👤  Users");
  for (const { passwordHash: _pw, ...user } of DEMO_USERS) {
    await db.user.upsert({
      where: { auth0Id: user.auth0Id },
      update: { email: user.email, name: user.name, role: user.role },
      create: user,
    });
    console.log(`   ✓ ${user.email}`);
  }

  // ── Products & variants ────────────────────────────────────────────────────
  console.log("\n📦  Products");
  for (const { variants, ...product } of DEMO_PRODUCTS) {
    await db.product.upsert({
      where: { slug: product.slug },
      update: { ...product },
      create: {
        ...product,
        variants: {
          create: variants.map((v) => ({
            ...v,
            options: v.options as object,
          })),
        },
      },
    });

    // Upsert variants separately so re-runs don't duplicate them
    for (const v of variants) {
      await db.productVariant.upsert({
        where: { sku: v.sku },
        update: { price: v.price, inventory: v.inventory },
        create: {
          ...v,
          options: v.options as object,
          productId: product.id,
        },
      });
    }
    console.log(`   ✓ ${product.name} (${variants.length} variants)`);
  }

  // ── Orders ─────────────────────────────────────────────────────────────────
  console.log("\n🛒  Orders");
  for (const { items, ...order } of DEMO_ORDERS) {
    await db.order.upsert({
      where: { id: order.id },
      update: { status: order.status },
      create: {
        ...order,
        shippingAddress: order.shippingAddress as object,
        items: {
          create: items.map((item) => ({
            ...item,
          })),
        },
      },
    });
    console.log(`   ✓ ${order.id}  [${order.status}]  $${order.total}`);
  }

  console.log("\n✅  Seed complete.\n");
}

main()
  .catch((e) => {
    console.error("❌  Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
