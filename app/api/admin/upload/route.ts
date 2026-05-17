
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import prisma from '@/lib/prisma';
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

export const runtime = 'nodejs';
const allowed = ['image/', 'video/mp4', 'video/webm'];
function safeName(name: string) { return name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/-+/g, '-'); }

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const folder = String(formData.get('folder') || 'products');
  const alt = String(formData.get('alt') || '');
  if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  const ok = file.type.startsWith('image/') || allowed.includes(file.type);
  if (!ok) return NextResponse.json({ error: 'Only image, GIF/WebP, MP4 or WebM files are allowed' }, { status: 400 });
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${Date.now()}-${safeName(file.name)}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);
  const url = `/uploads/${folder}/${filename}`;
  const asset = await prisma.mediaAsset.create({ data: { url, filename, mimeType: file.type, size: file.size, alt, folder } });
  return NextResponse.json(asset, { status: 201 });
}
