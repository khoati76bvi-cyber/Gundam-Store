import { Client } from 'pg';

const connectionString = "postgresql://postgres:ljgqTzSxAKQuz5dj@db.pdmnspougziufnbhidsl.supabase.co:5432/postgres";

async function main() {
  const client = new Client({ connectionString });
  await client.connect();
  console.log("🚀 Đã kết nối thẳng tới Supabase thành công!");

  try {
    // 1. Xóa dữ liệu cũ trong bảng Product
    await client.query('TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE;');
    console.log("🧹 Đã dọn dẹp sạch sẽ bảng cũ.");

    // 2. Chèn dữ liệu chuẩn theo Schema của bạn
    const query = `
      INSERT INTO "Product" (
        slug, name, category, grade, price, "compareAt", stock, image, gallery, badge, status, description, specs, featured, "createdAt", "updatedAt"
      ) VALUES
      (
        'mgex-strike-freedom', 
        'MGEX Strike Freedom Gundam', 
        'Master Grade Extreme', 
        'MGEX', 
        3500000, 
        3800000, 
        10, 
        'mgex-strike-freedom.jpg', 
        '[]', 
        'HOT', 
        'ACTIVE', 
        'Mô hình lắp ráp cao cấp với khung xương mạ vàng siêu chi tiết.', 
        '{}', 
        true, 
        NOW(), 
        NOW()
      ),
      (
        'rg-hi-nu-gundam', 
        'RG Hi-v Gundam', 
        'Real Grade', 
        'RG', 
        1250000, 
        1400000, 
        15, 
        'rg-hi-nu.jpg', 
        '[]', 
        'NEW', 
        'ACTIVE', 
        'Mô hình tỷ lệ 1/144 biên độ chuyển động xuất sắc nhất dòng RG.', 
        '{}', 
        false, 
        NOW(), 
        NOW()
      );
    `;

    await client.query(query);
    console.log("✨ Đã đổ bộ toàn bộ kho hàng Gundam lên Supabase thành công!");

  } catch (error) {
    console.error("❌ Lỗi rồi:", error);
  } finally {
    await client.end();
  }
}

main();