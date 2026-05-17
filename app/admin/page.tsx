import Link from "next/link";
import { prisma } from "@/lib/db";
import { AdminCard } from "@/components/admin/AdminCard";
import { formatVND } from "@/lib/format";

export default async function AdminDashboard() {
  const [products, orders, customers, banners] = await Promise.all([
    prisma.product.count(),
    prisma.order.findMany(),
    prisma.customer.count(),
    prisma.banner.count(),
  ]);

  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "NEW").length;

  const modules = [
    {
      title: "Quản lý sản phẩm",
      desc: "Thêm, sửa, xóa sản phẩm, giá bán, hình ảnh, trạng thái hiển thị.",
      href: "/admin/products",
    },
    {
      title: "Quản lý tồn kho",
      desc: "Theo dõi số lượng tồn, cảnh báo sắp hết hàng, cập nhật stock.",
      href: "/admin/inventory",
    },
    {
      title: "Quản lý banner",
      desc: "Upload banner, video, ảnh động, gắn link và bật/tắt hiển thị.",
      href: "/admin/banners",
    },
    {
      title: "Quản lý đơn hàng",
      desc: "Theo dõi đơn mới, xác nhận, đóng gói, giao hàng và hoàn tất.",
      href: "/admin/orders",
    },
    {
      title: "Khuyến mãi / chương trình",
      desc: "Tạo coupon, flash sale, combo deal, pre-order campaign.",
      href: "/admin/coupons",
    },
    {
      title: "Khách hàng",
      desc: "Danh sách khách hàng, lịch sử mua hàng, phân nhóm khách hàng.",
      href: "/admin/customers",
    },
    {
      title: "Người dùng",
      desc: "Quản lý tài khoản nhân viên, trạng thái hoạt động.",
      href: "/admin/users",
    },
    {
      title: "Role & phân quyền",
      desc: "Tạo vai trò Admin, Editor, Sales, CSKH và phân quyền truy cập.",
      href: "/admin/roles",
    },
    {
      title: "Theme & giao diện",
      desc: "Đổi màu, theme, bật/tắt section homepage, cấu hình layout.",
      href: "/admin/theme",
    },
  ];

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-400">
            GundamStore Admin CMS
          </p>
          <h1 className="mt-2 text-4xl font-black">Dashboard quản trị</h1>
          <p className="mt-2 text-white/60">
            Quản lý sản phẩm, banner, đơn hàng, tồn kho, khuyến mãi, người dùng
            và phân quyền.
          </p>
        </div>

        <Link
          href="/"
          className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-bold text-white hover:bg-red-600"
        >
          Xem website
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-5">
        <AdminCard title="Sản phẩm" value={products} hint="Tổng SKU" />
        <AdminCard title="Đơn hàng" value={orders.length} hint="Tổng đơn" />
        <AdminCard title="Đơn mới" value={pendingOrders} hint="Cần xử lý" />
        <AdminCard title="Khách hàng" value={customers} hint="Đã lưu" />
        <AdminCard title="Doanh thu" value={formatVND(revenue)} hint="Demo" />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {modules.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:bg-red-500/10 hover:shadow-[0_0_35px_rgba(239,68,68,.18)]"
          >
            <h2 className="text-xl font-black group-hover:text-red-400">
              {m.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/60">{m.desc}</p>
            <div className="mt-5 text-sm font-bold text-red-400">
              Mở quản lý →
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-6">
        <h2 className="text-xl font-bold">Trạng thái CMS</h2>
        <p className="mt-2 text-white/70">
          Database SQLite đã kết nối. Các module sẽ được nâng cấp dần thành CRUD
          thật: sản phẩm, banner, đơn hàng, role, user và chương trình khuyến
          mãi.
        </p>
      </div>
    </div>
  );
}
