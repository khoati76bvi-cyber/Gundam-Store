
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const data = await prisma.banner.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const data = await prisma.banner.create({ data: body });
  return NextResponse.json(data, { status: 201 });
}
