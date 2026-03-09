# E-Commerce Core

> A high-performance, production-grade e-commerce foundation built with Next.js 14 and Tailwind CSS.

![Status](https://img.shields.io/badge/status-production-brightgreen)
![Stack](https://img.shields.io/badge/stack-Next.js%2014%20%2F%20Tailwind%20%2F%20TypeScript-black)
![License](https://img.shields.io/badge/license-private-red)

---

## Overview

E-Commerce Core is a modular, scalable storefront architecture engineered for performance and conversion. Built with a security-first mindset and optimized for global edge deployment, this system handles everything from product catalog rendering to checkout flow and order management.

This is not a template. It is a battle-hardened foundation designed to be extended into a full commercial product with minimal friction.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL + Prisma ORM |
| Auth | Auth0 / JWT |
| Payments | Stripe |
| Cache | Redis |
| Deployment | Vercel + AWS CloudFront |
| CI/CD | GitHub Actions |

---

## Features

- **Server Components by default** — minimized client-side JavaScript, faster TTI
- **Edge-optimized image pipeline** — Next.js Image with CDN fallback
- **Cart state management** — persistent cart via Redis, synced across devices
- **Dynamic product catalog** — real-time inventory with optimistic UI updates
- **Checkout flow** — multi-step, Stripe-integrated, PCI-compliant
- **Role-based access** — admin / customer / guest permission layers
- **SEO-ready** — dynamic metadata generation, OG tags, structured data (JSON-LD)
- **Core Web Vitals** — LCP < 1.5s, CLS < 0.1, FID < 100ms (lighthouse ≥ 95)

---

## Project Structure

```
/
├── app/
│   ├── (storefront)/       # Public-facing routes
│   │   ├── page.tsx        # Homepage / featured products
│   │   ├── products/       # Catalog & PDP
│   │   └── checkout/       # Multi-step checkout
│   ├── (admin)/            # Protected admin dashboard
│   │   ├── orders/
│   │   └── inventory/
│   └── api/                # Route handlers
├── components/
│   ├── ui/                 # Primitive components
│   ├── product/            # Product card, gallery, meta
│   └── cart/               # Cart drawer, line items
├── lib/
│   ├── db.ts               # Prisma client singleton
│   ├── redis.ts            # Redis connection
│   └── stripe.ts           # Stripe helpers
├── prisma/
│   └── schema.prisma
└── public/
```

---

## Getting Started

### Prerequisites

- Node.js >= 20
- PostgreSQL instance (local or hosted)
- Redis instance
- Stripe account (test keys)
- Auth0 tenant

### Installation

```bash
git clone https://github.com/mbstuDEV/ecommerce-core.git
cd ecommerce-core
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce"

# Redis
REDIS_URL="redis://localhost:6379"

# Auth0
AUTH0_SECRET=""
AUTH0_BASE_URL="http://localhost:3000"
AUTH0_ISSUER_BASE_URL=""
AUTH0_CLIENT_ID=""
AUTH0_CLIENT_SECRET=""

# Stripe
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
```

### Database Setup

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run test         # Jest + Testing Library
npm run test:e2e     # Playwright end-to-end tests
```

---

## Deployment

This project is configured for zero-downtime deployment via GitHub Actions → Vercel with AWS CloudFront as the CDN layer.

Push to `main` triggers the production pipeline. Push to any feature branch creates a preview deployment automatically.

See `.github/workflows/deploy.yml` for the full CI/CD configuration.

---

## Security

- All API routes validate JWT tokens server-side
- Stripe webhooks verified via signature
- CSRF protection on all mutation endpoints
- Rate limiting via Redis on auth and checkout routes
- Environment secrets managed via Vercel / AWS Secrets Manager — never committed

---

## License

Private. All rights reserved. © 2024 muntasirbergam.studio
