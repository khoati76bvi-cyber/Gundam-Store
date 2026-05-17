
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
export async function GET() { return NextResponse.json(await prisma.setting.findMany({ orderBy: { key: 'asc' } })); }
export async function POST(req: Request) {
  const body = await req.json();
  const data = await prisma.setting.upsert({ where: { key: body.key }, update: { value: body.value }, create: { key: body.key, value: body.value } });
  return NextResponse.json(data);
}
