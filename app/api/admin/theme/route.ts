import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const rows = await prisma.setting.findMany({ where: { OR: [{ key: { startsWith: 'theme.' } }, { key: { startsWith: 'section.' } }, { key: { startsWith: 'layout.' } }] } });
  return NextResponse.json(Object.fromEntries(rows.map(r => [r.key, r.value])));
}

export async function PUT(req: Request) {
  const body = await req.json() as Record<string, string | boolean | number>;
  const entries = Object.entries(body);
  await Promise.all(entries.map(([key, value]) => prisma.setting.upsert({
    where: { key },
    update: { value: String(value) },
    create: { key, value: String(value) }
  })));
  return NextResponse.json({ ok: true });
}
