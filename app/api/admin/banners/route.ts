import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 🌟 Bắt buộc Next.js không được quét tĩnh file này lúc build
export const dynamic = 'force-dynamic';

export async function GET() {
  // LỚP BẢO VỆ 1: Nếu khâu build của Vercel chưa nạp kịp env, trả về mảng rỗng để pass qua nhanh
  if (!process.env.DATABASE_URL) {
    return NextResponse.json([]);
  }

  try {
    // LỚP BẢO VỆ 2: Thêm .catch(() => []) để db có lag lúc biên dịch cũng không làm sập tiến trình
    const data = await prisma.banner.findMany({
      orderBy: { sortOrder: 'asc' }
    }).catch(() => []);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  // LỚP BẢO VỆ 1: Chặn sập khâu build
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Database not connected" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const data = await prisma.banner.create({
      data: body
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("❌ Lỗi tạo banner:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}