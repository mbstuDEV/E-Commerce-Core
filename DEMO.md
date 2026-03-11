# Demo Mode

A zero-configuration preview of the full storefront and admin dashboard, running entirely off fixture data — no PostgreSQL, Redis, Stripe, or Auth0 required.

---

## Quick start

```bash
cp .env.demo .env.local
npm install
npm run dev
```

Then open:

| URL | What it shows |
|-----|---------------|
| `http://localhost:3000/demo` | Interactive storefront — browse products, add to cart |
| `http://localhost:3000/admin/demo` | Admin dashboard — revenue stats, recent orders |

---

## Demo API

All fixture data is served from a single endpoint when `NEXT_PUBLIC_DEMO_MODE=true`.

```
GET /api/demo?resource=<resource>
```

| Resource | Description |
|----------|-------------|
| `products` | Paginated product list. Supports `?category=`, `?tag=`, `?featured=true`, `?q=` |
| `product` | Single product by `?slug=` |
| `orders` | All orders, or filter by `?userId=` |
| `cart` | Demo cart with two pre-loaded items |
| `users` | Demo users (passwords omitted) |
| `categories` | Unique category list |
| `stats` | Revenue, order count, product count, low-stock count + recent orders |

### Example requests

```bash
# All products
curl http://localhost:3000/api/demo?resource=products

# Tech products only
curl "http://localhost:3000/api/demo?resource=products&category=Tech"

# Admin stats
curl http://localhost:3000/api/demo?resource=stats
```

---

## Fixture data

Demo data lives in `demo/fixtures.ts`:

- **8 products** across Apparel, Footwear, Accessories, and Tech
- **22 variants** with realistic stock levels (including sold-out SKUs)
- **4 orders** across 2 customers covering all order statuses
- **3 users**: 1 admin + 2 customers
- **1 pre-filled cart** with 2 items

To customise the demo, edit `demo/fixtures.ts` — changes are reflected immediately in both demo pages and the seed script.

---

## Seeding a real database

When you're ready to connect a real PostgreSQL database:

1. Update `DATABASE_URL` in `.env.local`
2. Run the seed script:

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

This populates your database with the same fixture data used in demo mode.

---

## What's disabled in demo mode

- **Stripe checkout** — the checkout button on `/demo` is non-functional
- **Auth0** — demo pages are publicly accessible without login
- **Redis cart** — `/demo` uses local React state instead

All real routes (`/api/cart`, `/api/checkout`, `/api/products`, etc.) remain fully functional and require the real service credentials.
