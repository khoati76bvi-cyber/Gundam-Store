
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const data = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const data = await prisma.coupon.create({ data: body });
  return NextResponse.json(data, { status: 201 });
}
