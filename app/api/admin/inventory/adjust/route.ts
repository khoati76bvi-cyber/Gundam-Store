
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
export const dynamic = 'force-dynamic';
export async function POST(req: Request) {
  const { productId, type, quantity, note } = await req.json();
  const qty = Number(quantity || 0);
  const product = await prisma.product.findUnique({ where: { id: Number(productId) } });
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  const delta = type === 'OUT' ? -qty : qty;
  const updated = await prisma.product.update({ where: { id: product.id }, data: { stock: Math.max(0, product.stock + delta) } });
  const log = await prisma.inventoryLog.create({ data: { productId: product.id, productName: product.name, type, quantity: qty, note } });
  return NextResponse.json({ product: updated, log });
}
