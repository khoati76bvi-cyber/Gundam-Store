
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
export const dynamic = 'force-dynamic';
export async function GET() { return NextResponse.json(await prisma.inventoryLog.findMany({ orderBy: { createdAt: 'desc' } })); }
export async function POST(req: Request) {
  const body = await req.json();
  const data = await prisma.inventoryLog.create({ data: body });
  return NextResponse.json(data, { status: 201 });
}
