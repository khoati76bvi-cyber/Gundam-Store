
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const data = await prisma.banner.findUnique({ where: { id: Number(params.id) } });
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const data = await prisma.banner.update({ where: { id: Number(params.id) }, data: body });
  return NextResponse.json(data);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.banner.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ ok: true });
}
