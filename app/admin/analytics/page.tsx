import { prisma } from '@/lib/db';
import { formatVND } from '@/lib/format';

function Card({ title, value, hint }: { title: string; value: any; hint: string }) {
  return <div className="rounded-3xl border border-white/10 bg-white/[.04] p-5">
    <div className="text-white/55 text-sm">{title}</div>
    <div className="text-2xl font-black mt-2">{value}</div>
    <div className="text-white/45 text-xs mt-2">{hint}</div>
  </div>
}

function BarList({ title, rows }: { title: string; rows: any[] }) {
  const max = Math.max(1, ...rows.map(r => r.value || r.stock || 0));
  return <div className="rounded-3xl border border-white/10 bg-white/[.04] p-5">
    <h2 className="font-black text-lg mb-4">{title}</h2>
    <div className="space-y-3">{rows.length ? rows.map((r, i) => <div key={i}>
      <div className="flex justify-between text-sm gap-4"><span className="text-white/80 truncate">{r.name}</span><b>{r.value ?? r.stock}</b></div>
      <div className="h-2 mt-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-cyan-300 rounded-full" style={{ width: `${Math.max(8, ((r.value ?? r.stock) / max) * 100)}%` }} /></div>
    </div>) : <div className="text-white/45 text-sm">Chưa đủ dữ liệu.</div>}</div>
  </div>
}

export default async function AnalyticsPage() {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [events, searches, orders, products] = await Promise.all([
    prisma.analyticsEvent.findMany({ where: { createdAt: { gte: since } }, orderBy: { createdAt: 'desc' }, take: 2000 }),
    prisma.searchInsight.findMany({ where: { createdAt: { gte: since } }, orderBy: { createdAt: 'desc' }, take: 1000 }),
    prisma.order.findMany({ where: { createdAt: { gte: since } }, include: { items: true } }),
    prisma.product.findMany()
  ]);
  const countBy = (items: any[], key: string) => {
    const map = new Map<string, number>();
    for (const it of items) { const k = it[key] || 'Unknown'; map.set(k, (map.get(k) || 0) + 1); }
    return [...map.entries()].map(([name, value]) => ({ name, value })).sort((a,b)=>b.value-a.value);
  };
  const pageViews = events.filter(e => e.type === 'PAGE_VIEW');
  const productViews = events.filter(e => e.type === 'PRODUCT_VIEW');
  const cartAdds = events.filter(e => e.type === 'ADD_TO_CART');
  const sessions = new Set(events.map(e => e.sessionId)).size;
  const revenue = orders.reduce((s,o)=>s+o.total,0);
  const conversionRate = sessions ? Math.round((orders.length / sessions) * 10000) / 100 : 0;
  const aov = orders.length ? Math.round(revenue / orders.length) : 0;
  const topProducts = countBy(productViews, 'productName').slice(0, 8);
  const topCartProducts = countBy(cartAdds, 'productName').slice(0, 8);
  const topSearches = countBy(searches.map(s => ({ keyword: s.keyword })), 'keyword').slice(0, 10);
  const zeroSearches = countBy(searches.filter(s => s.resultCount === 0).map(s => ({ keyword: s.keyword })), 'keyword').slice(0, 10);
  const topPages = countBy(pageViews, 'path').slice(0, 10);
  const purchasedNames = countBy(orders.flatMap(o => o.items.map(i => ({ name: i.name }))), 'name');
  const lowConversion = topProducts.filter(p => !purchasedNames.find(x => x.name === p.name)).slice(0, 5);
  const lowStock = products.filter(p => p.stock <= 5).map(p => ({ name: p.name, stock: p.stock }));
  const insights = [
    topSearches[0] ? `Đẩy SEO/campaign cho “${topSearches[0].name}” vì là nhu cầu tìm kiếm nổi bật.` : 'Cần thêm dữ liệu search để xác định nhu cầu thị trường.',
    zeroSearches[0] ? `Từ khóa “${zeroSearches[0].name}” chưa có kết quả: cân nhắc nhập hàng, thêm synonym hoặc landing page.` : 'Chưa có nhiều search không ra kết quả.',
    lowConversion[0] ? `“${lowConversion[0].name}” được xem nhiều nhưng chưa chuyển đổi: test ảnh mới, bundle, giảm giá hoặc review thật.` : 'Chưa phát hiện sản phẩm view cao nhưng chuyển đổi yếu.',
    lowStock[0] ? `“${lowStock[0].name}” sắp hết hàng: nên nhập thêm hoặc bật preorder.` : 'Tồn kho chưa có cảnh báo lớn.'
  ];

  return <div>
    <h1 className="text-3xl font-black">User Behavior Intelligence</h1>
    <p className="text-white/60 mt-2">Theo dõi hành vi người dùng để ra quyết định nhập hàng, banner, campaign và UX.</p>
    <div className="grid md:grid-cols-4 gap-4 mt-8">
      <Card title="Sessions" value={sessions} hint="Người dùng/phiên trong 30 ngày" />
      <Card title="Product Views" value={productViews.length} hint="Lượt xem sản phẩm" />
      <Card title="Add to Cart" value={cartAdds.length} hint="Tín hiệu mua hàng" />
      <Card title="Conversion" value={`${conversionRate}%`} hint="Đơn hàng / sessions" />
      <Card title="Revenue" value={formatVND(revenue)} hint="Doanh thu 30 ngày" />
      <Card title="AOV" value={formatVND(aov)} hint="Giá trị đơn trung bình" />
      <Card title="Searches" value={searches.length} hint="Số lượt tìm kiếm" />
      <Card title="Orders" value={orders.length} hint="Đơn hàng phát sinh" />
    </div>
    <div className="grid lg:grid-cols-2 gap-5 mt-8">
      <BarList title="Top Viewed Products" rows={topProducts} />
      <BarList title="Top Add-to-Cart Products" rows={topCartProducts} />
      <BarList title="Top Search Keywords" rows={topSearches} />
      <BarList title="Search No Result" rows={zeroSearches} />
      <BarList title="Top Pages" rows={topPages} />
      <BarList title="Low Stock Alerts" rows={lowStock} />
    </div>
    <div className="mt-8 rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-6">
      <h2 className="font-black text-xl">Strategic Recommendations</h2>
      <div className="grid md:grid-cols-2 gap-4 mt-4">{insights.map((x,i)=><div key={i} className="rounded-2xl bg-black/25 border border-white/10 p-4 text-white/80">{x}</div>)}</div>
    </div>
  </div>
}
