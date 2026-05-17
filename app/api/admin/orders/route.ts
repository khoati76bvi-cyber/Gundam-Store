
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
export const dynamic = 'force-dynamic';
export async function GET() {
  const data = await prisma.order.findMany({ orderBy: { createdAt: 'desc' }, include: { items: true, customer: true } });
  return NextResponse.json(data);
}
export async function POST(req: Request) {
  const body = await req.json();
  const code = `GDS-${Date.now().toString().slice(-6)}`;
  const data = await prisma.order.create({ data: { ...body, code } });
  return NextResponse.json(data, { status: 201 });
}
