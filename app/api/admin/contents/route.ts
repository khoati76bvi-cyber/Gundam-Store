
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
export async function GET() { return NextResponse.json(await prisma.contentPage.findMany({ orderBy: { updatedAt: 'desc' } })); }
export async function POST(req: Request) {
  const body = await req.json();
  const data = await prisma.contentPage.create({ data: body });
  return NextResponse.json(data, { status: 201 });
}
