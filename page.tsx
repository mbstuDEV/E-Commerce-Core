import { db } from '@/lib/db';

// Homepage — server component.
// Fetches featured products directly from the DB with no client-side waterfall.

export default async function HomePage() {
  const featured = await db.product.findMany({
    where: { featured: true, active: true },
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: { images: { take: 1 } },
  });

  return (
    <div>
      {/* Hero */}
      <section className="px-6 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          Shop the Collection
        </h1>
        <p className="mt-4 text-lg text-neutral-500">
          Free shipping on orders over $75.
        </p>
      </section>

      {/* Featured Products Grid */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <h2 className="mb-8 text-xl font-semibold">Featured</h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
          {featured.map((product) => (
            <div key={product.id}>
              {/* TODO: <ProductCard product={product} /> */}
              <p className="font-medium">{product.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
