/**
 * demo/fixtures.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Static fixture data used by the Prisma seed script AND the demo API route.
 * No external services required — everything runs in-memory / local DB.
 */

import type { Product, Order, User } from "@/types";

// ─── Users ────────────────────────────────────────────────────────────────────

export const DEMO_USERS: (User & { passwordHash: string })[] = [
  {
    id: "user_demo_admin",
    auth0Id: "auth0|demo_admin",
    email: "admin@demo.store",
    name: "Alex Admin",
    role: "ADMIN",
    passwordHash: "", // not used — Auth0 handles auth
  },
  {
    id: "user_demo_customer_1",
    auth0Id: "auth0|demo_customer_1",
    email: "sam@demo.store",
    name: "Sam Customer",
    role: "CUSTOMER",
    passwordHash: "",
  },
  {
    id: "user_demo_customer_2",
    auth0Id: "auth0|demo_customer_2",
    email: "jordan@demo.store",
    name: "Jordan Buyer",
    role: "CUSTOMER",
    passwordHash: "",
  },
];

// ─── Products ─────────────────────────────────────────────────────────────────

export const DEMO_PRODUCTS = [
  // ── Apparel ──────────────────────────────────────────────────────────────
  {
    id: "prod_001",
    slug: "essential-tee",
    name: "Essential Tee",
    description:
      "A clean, heavyweight 100% cotton tee. Pre-shrunk and built to last season after season.",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format",
    ],
    category: "Apparel",
    tags: ["tee", "basics", "cotton"],
    featured: true,
    variants: [
      { id: "var_001_s",  sku: "ETEE-BLK-S",  price: 32,  compareAtPrice: null, inventory: 20, options: { color: "Black", size: "S" } },
      { id: "var_001_m",  sku: "ETEE-BLK-M",  price: 32,  compareAtPrice: null, inventory: 15, options: { color: "Black", size: "M" } },
      { id: "var_001_l",  sku: "ETEE-BLK-L",  price: 32,  compareAtPrice: null, inventory: 8,  options: { color: "Black", size: "L" } },
      { id: "var_001_xl", sku: "ETEE-BLK-XL", price: 32,  compareAtPrice: null, inventory: 3,  options: { color: "Black", size: "XL" } },
      { id: "var_001_wm", sku: "ETEE-WHT-M",  price: 32,  compareAtPrice: null, inventory: 12, options: { color: "White", size: "M" } },
      { id: "var_001_wl", sku: "ETEE-WHT-L",  price: 32,  compareAtPrice: null, inventory: 0,  options: { color: "White", size: "L" } },
    ],
  },
  {
    id: "prod_002",
    slug: "coach-jacket",
    name: "Coach Jacket",
    description:
      "Lightweight ripstop shell with a satin lining. Packable, water-resistant, and effortlessly clean.",
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format",
      "https://images.unsplash.com/photo-1608063615781-e2ef8c73d114?w=800&auto=format",
    ],
    category: "Apparel",
    tags: ["jacket", "outerwear", "packable"],
    featured: true,
    variants: [
      { id: "var_002_s", sku: "CJ-OLV-S", price: 128, compareAtPrice: 160, inventory: 6,  options: { color: "Olive", size: "S" } },
      { id: "var_002_m", sku: "CJ-OLV-M", price: 128, compareAtPrice: 160, inventory: 9,  options: { color: "Olive", size: "M" } },
      { id: "var_002_l", sku: "CJ-OLV-L", price: 128, compareAtPrice: 160, inventory: 4,  options: { color: "Olive", size: "L" } },
      { id: "var_002_nm", sku: "CJ-NVY-M", price: 128, compareAtPrice: 160, inventory: 0,  options: { color: "Navy",  size: "M" } },
    ],
  },
  {
    id: "prod_003",
    slug: "cargo-pants",
    name: "Cargo Pants",
    description:
      "Six-pocket cargo silhouette in a durable ripstop cotton blend. Relaxed taper, built for movement.",
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format",
    ],
    category: "Apparel",
    tags: ["pants", "cargo", "relaxed"],
    featured: false,
    variants: [
      { id: "var_003_30", sku: "CP-STN-30", price: 96,  compareAtPrice: null, inventory: 10, options: { color: "Stone", waist: "30" } },
      { id: "var_003_32", sku: "CP-STN-32", price: 96,  compareAtPrice: null, inventory: 7,  options: { color: "Stone", waist: "32" } },
      { id: "var_003_34", sku: "CP-STN-34", price: 96,  compareAtPrice: null, inventory: 2,  options: { color: "Stone", waist: "34" } },
    ],
  },

  // ── Footwear ─────────────────────────────────────────────────────────────
  {
    id: "prod_004",
    slug: "runner-low",
    name: "Runner Low",
    description:
      "Low-profile runner with a recycled mesh upper and responsive foam midsole. All-day comfort, zero compromise.",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format",
    ],
    category: "Footwear",
    tags: ["sneakers", "runner", "recycled"],
    featured: true,
    variants: [
      { id: "var_004_8",  sku: "RL-WHT-8",  price: 145, compareAtPrice: null, inventory: 5,  options: { color: "White", size: "8"  } },
      { id: "var_004_9",  sku: "RL-WHT-9",  price: 145, compareAtPrice: null, inventory: 8,  options: { color: "White", size: "9"  } },
      { id: "var_004_10", sku: "RL-WHT-10", price: 145, compareAtPrice: null, inventory: 6,  options: { color: "White", size: "10" } },
      { id: "var_004_11", sku: "RL-WHT-11", price: 145, compareAtPrice: null, inventory: 0,  options: { color: "White", size: "11" } },
      { id: "var_004_b9", sku: "RL-BLK-9",  price: 145, compareAtPrice: null, inventory: 4,  options: { color: "Black", size: "9"  } },
    ],
  },

  // ── Accessories ───────────────────────────────────────────────────────────
  {
    id: "prod_005",
    slug: "canvas-tote",
    name: "Canvas Tote",
    description:
      "12 oz waxed canvas with leather handles and a zip interior pocket. Holds a 16\" laptop comfortably.",
    images: [
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format",
    ],
    category: "Accessories",
    tags: ["bag", "tote", "canvas"],
    featured: false,
    variants: [
      { id: "var_005_nat", sku: "CT-NAT", price: 68, compareAtPrice: null, inventory: 25, options: { color: "Natural" } },
      { id: "var_005_blk", sku: "CT-BLK", price: 68, compareAtPrice: null, inventory: 18, options: { color: "Black"   } },
    ],
  },
  {
    id: "prod_006",
    slug: "snapback-cap",
    name: "Snapback Cap",
    description:
      "6-panel structured cap with an embroidered logo and adjustable snapback closure. One size fits most.",
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format",
    ],
    category: "Accessories",
    tags: ["hat", "cap", "snapback"],
    featured: false,
    variants: [
      { id: "var_006_blk", sku: "SB-BLK", price: 38, compareAtPrice: null, inventory: 30, options: { color: "Black" } },
      { id: "var_006_wht", sku: "SB-WHT", price: 38, compareAtPrice: null, inventory: 22, options: { color: "White" } },
      { id: "var_006_tan", sku: "SB-TAN", price: 38, compareAtPrice: null, inventory: 5,  options: { color: "Tan"   } },
    ],
  },

  // ── Tech ──────────────────────────────────────────────────────────────────
  {
    id: "prod_007",
    slug: "wireless-earbuds",
    name: "Wireless Earbuds",
    description:
      "40-hour total battery, ANC, IPX5 water resistance. USB-C charging case included.",
    images: [
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&auto=format",
    ],
    category: "Tech",
    tags: ["audio", "earbuds", "wireless"],
    featured: true,
    variants: [
      { id: "var_007_blk", sku: "WE-BLK", price: 189, compareAtPrice: 230, inventory: 12, options: { color: "Matte Black"  } },
      { id: "var_007_wht", sku: "WE-WHT", price: 189, compareAtPrice: 230, inventory: 7,  options: { color: "Pearl White"  } },
    ],
  },
  {
    id: "prod_008",
    slug: "laptop-stand",
    name: "Laptop Stand",
    description:
      "Adjustable aluminium stand, 6 height settings, foldable to 8mm. Compatible with laptops 11\"–17\".",
    images: [
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&auto=format",
    ],
    category: "Tech",
    tags: ["desk", "ergonomic", "aluminium"],
    featured: false,
    variants: [
      { id: "var_008_slv", sku: "LS-SLV", price: 54, compareAtPrice: null, inventory: 40, options: { finish: "Silver" } },
      { id: "var_008_blk", sku: "LS-BLK", price: 54, compareAtPrice: null, inventory: 28, options: { finish: "Black"  } },
    ],
  },
];

// ─── Orders ───────────────────────────────────────────────────────────────────

export const DEMO_ORDERS = [
  {
    id: "order_demo_001",
    userId: "user_demo_customer_1",
    status: "DELIVERED",
    stripeSessionId: "cs_test_demo_001",
    stripePaymentIntentId: "pi_test_demo_001",
    subtotal: 177,
    tax: 15.93,
    shipping: 0,
    total: 192.93,
    shippingAddress: {
      line1: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "US",
    },
    createdAt: new Date("2026-02-14T10:22:00Z"),
    items: [
      { productId: "prod_001", variantId: "var_001_m",  name: "Essential Tee — Black / M",  price: 32,  quantity: 1, image: DEMO_PRODUCTS[0].images[0] },
      { productId: "prod_004", variantId: "var_004_10", name: "Runner Low — White / 10",     price: 145, quantity: 1, image: DEMO_PRODUCTS[3].images[0] },
    ],
  },
  {
    id: "order_demo_002",
    userId: "user_demo_customer_2",
    status: "SHIPPED",
    stripeSessionId: "cs_test_demo_002",
    stripePaymentIntentId: "pi_test_demo_002",
    subtotal: 256,
    tax: 23.04,
    shipping: 0,
    total: 279.04,
    shippingAddress: {
      line1: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90001",
      country: "US",
    },
    createdAt: new Date("2026-02-20T14:05:00Z"),
    items: [
      { productId: "prod_002", variantId: "var_002_m",  name: "Coach Jacket — Olive / M", price: 128, quantity: 1, image: DEMO_PRODUCTS[1].images[0] },
      { productId: "prod_007", variantId: "var_007_blk", name: "Wireless Earbuds — Matte Black", price: 189, quantity: 1, image: DEMO_PRODUCTS[6].images[0] },
    ],
  },
  {
    id: "order_demo_003",
    userId: "user_demo_customer_1",
    status: "PROCESSING",
    stripeSessionId: "cs_test_demo_003",
    stripePaymentIntentId: "pi_test_demo_003",
    subtotal: 106,
    tax: 9.54,
    shipping: 8,
    total: 123.54,
    shippingAddress: {
      line1: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "US",
    },
    createdAt: new Date("2026-03-01T09:11:00Z"),
    items: [
      { productId: "prod_005", variantId: "var_005_nat", name: "Canvas Tote — Natural", price: 68, quantity: 1, image: DEMO_PRODUCTS[4].images[0] },
      { productId: "prod_006", variantId: "var_006_blk", name: "Snapback Cap — Black",  price: 38, quantity: 1, image: DEMO_PRODUCTS[5].images[0] },
    ],
  },
  {
    id: "order_demo_004",
    userId: "user_demo_customer_2",
    status: "PENDING",
    stripeSessionId: "cs_test_demo_004",
    stripePaymentIntentId: "pi_test_demo_004",
    subtotal: 54,
    tax: 4.86,
    shipping: 0,
    total: 58.86,
    shippingAddress: {
      line1: "789 Elm Rd",
      city: "Chicago",
      state: "IL",
      postalCode: "60601",
      country: "US",
    },
    createdAt: new Date("2026-03-09T18:44:00Z"),
    items: [
      { productId: "prod_008", variantId: "var_008_slv", name: "Laptop Stand — Silver", price: 54, quantity: 1, image: DEMO_PRODUCTS[7].images[0] },
    ],
  },
];

// ─── Cart fixture (used by demo cart preview) ──────────────────────────────────

export const DEMO_CART_ITEMS = [
  {
    productId: "prod_001",
    variantId: "var_001_m",
    quantity: 2,
    price: 32,
    name: "Essential Tee",
    image: DEMO_PRODUCTS[0].images[0],
    options: { color: "Black", size: "M" },
  },
  {
    productId: "prod_007",
    variantId: "var_007_blk",
    quantity: 1,
    price: 189,
    name: "Wireless Earbuds",
    image: DEMO_PRODUCTS[6].images[0],
    options: { color: "Matte Black" },
  },
];
