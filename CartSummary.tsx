import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { PaginatedResponse } from "@/types";
import type { Product } from "@/types";

// ─── GET /api/products ────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const pageSize = Math.min(50, Number(searchParams.get("pageSize") ?? 12));
  const category = searchParams.get("category") ?? undefined;
  const tag = searchParams.get("tag") ?? undefined;
  const featured = searchParams.get("featured") === "true" ? true : undefined;
  const q = searchParams.get("q") ?? undefined;

  const where = {
    ...(category && { category }),
    ...(featured !== undefined && { featured }),
    ...(tag && { tags: { has: tag } }),
    ...(q && {
      OR: [
        { name: { contains: q, mode: "insensitive" as const } },
        { description: { contains: q, mode: "insensitive" as const } },
      ],
    }),
  };

  const [total, products] = await Promise.all([
    db.product.count({ where }),
    db.product.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        variants: {
          orderBy: { price: "asc" },
          take: 1, // cheapest variant for listing price
        },
      },
    }),
  ]);

  const response: PaginatedResponse<Product> = {
    data: products as unknown as Product[],
    total,
    page,
    pageSize,
    hasMore: page * pageSize < total,
  };

  return NextResponse.json(response, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}
