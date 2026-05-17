import prisma from '@/lib/prisma';
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
export const revalidate = 300;
export async function GET() {
  return NextResponse.json({ items: products, total: products.length }, { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' } });
}
