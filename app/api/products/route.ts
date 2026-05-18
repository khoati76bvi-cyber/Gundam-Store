import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Import file Prisma Global dùng chung đã setup

export const dynamic = 'force-dynamic'; // Ép API luôn chạy dynamic để không bị lỗi build tĩnh
export const revalidate = 300;

export async function GET() {
  try {
    // ✨ BƯỚC QUAN TRỌNG: Kéo danh sách Gundam thực tế từ database Supabase lên
    const products = await prisma.product.findMany({
      where: {
        status: 'ACTIVE' // Chỉ lấy các sản phẩm đang mở bán
      },
      orderBy: {
        createdAt: 'desc' // Đưa hàng mới lên đầu
      }
    });

    // Trả về JSON chuẩn cấu trúc cũ của bạn
    return NextResponse.json(
      { items: products, total: products.length },
      {
        headers: {
          'Cache-Control': 's-maxage=300, stale-while-revalidate=600'
        }
      }
    );
  } catch (error) {
    console.error("❌ Lỗi lấy sản phẩm:", error);
    return NextResponse.json({ items: [], total: 0, error: "Internal Server Error" }, { status: 500 });
  }
}