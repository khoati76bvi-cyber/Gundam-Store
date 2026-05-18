import Link from 'next/link';

// 🌟 THẦN CHÚ CHÍNH: Ép trang 404 luôn render dynamic, không cho Next.js tự ý build tĩnh
export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h2 className="text-4xl font-black text-yellow-500 mb-2">404 - KHÔNG TÌM THẤY TRANG</h2>
      <p className="text-zinc-400 mb-6 text-center">
        Mô hình Gundam bạn đang tìm kiếm có vẻ đã "bay" khỏi hệ thống hoặc chưa được lắp ráp!
      </p>
      <Link
        href="/"
        className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-xl transition-colors"
      >
        Quay lại trang chủ Store
      </Link>
    </div>
  );
}