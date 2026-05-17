import prisma from '@/lib/prisma';
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

export async function GET() {
  const rows = await prisma.setting.findMany({ where: { OR: [{ key: { startsWith: 'theme.' } }, { key: { startsWith: 'section.' } }, { key: { startsWith: 'layout.' } }] } });
  return NextResponse.json(Object.fromEntries(rows.map((r: any) => [r.key, r.value])));
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
