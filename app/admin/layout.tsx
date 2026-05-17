
import Link from 'next/link';
const items = [
  ['Dashboard','/admin'], ['Analytics','/admin/analytics'], ['Theme Builder','/admin/theme'], ['Products','/admin/products'], ['Media','/admin/media'], ['Inventory','/admin/inventory'], ['Content','/admin/contents'], ['Banners','/admin/banners'], ['Orders','/admin/orders'], ['Customers','/admin/customers'], ['Coupons','/admin/coupons'], ['Settings','/admin/settings'], ['View Store','/']
];
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#070b16] text-white flex">
    <aside className="w-64 hidden md:block border-r border-white/10 p-5 sticky top-0 h-screen">
      <div className="text-2xl font-black text-cyan-300 mb-8">Gundam CMS</div>
      <nav className="space-y-2">{items.map(([label,href])=><Link key={href} href={href} className="block rounded-xl px-4 py-3 text-sm text-white/75 hover:bg-cyan-400/10 hover:text-cyan-200">{label}</Link>)}</nav>
    </aside>
    <main className="flex-1 p-4 md:p-8">{children}</main>
  </div>
}
