import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [events, searches, orders, products] = await Promise.all([
    prisma.analyticsEvent.findMany({ where: { createdAt: { gte: since } }, orderBy: { createdAt: 'desc' }, take: 2000 }),
    prisma.searchInsight.findMany({ where: { createdAt: { gte: since } }, orderBy: { createdAt: 'desc' }, take: 1000 }),
    prisma.order.findMany({ where: { createdAt: { gte: since } }, include: { items: true } }),
    prisma.product.findMany()
  ]);

  const countBy = (items: any[], key: string) => {
    const map = new Map<string, number>();
    for (const it of items) {
      const k = it[key] || 'Unknown';
      map.set(k, (map.get(k) || 0) + 1);
    }
    // ĐH SỬA: Thay toán tử rải [...] bằng Array.from() để sửa lỗi DownlevelIteration
    return Array.from(map.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  };

  // ĐH SỬA: Ép kiểu (: any) cho e, s, o để tránh lỗi Implicitly has an 'any' type
  const pageViews = events.filter((e: any) => e.type === 'PAGE_VIEW');
  const productViews = events.filter((e: any) => e.type === 'PRODUCT_VIEW');
  const cartAdds = events.filter((e: any) => e.type === 'ADD_TO_CART');
  const bannerClicks = events.filter((e: any) => e.type === 'BANNER_CLICK');
  const sessions = new Set(events.map((e: any) => e.sessionId)).size;
  const revenue = orders.reduce((s: number, o: any) => s + o.total, 0);
  const conversionRate = sessions ? Math.round((orders.length / sessions) * 10000) / 100 : 0;
  const aov = orders.length ? Math.round(revenue / orders.length) : 0;

  const topProducts = countBy(productViews, 'productName').slice(0, 8);
  const topCartProducts = countBy(cartAdds, 'productName').slice(0, 8);
  const topSearches = countBy(searches.map((s: any) => ({ keyword: s.keyword })), 'keyword').slice(0, 10);
  const zeroSearches = countBy(searches.filter((s: any) => s.resultCount === 0).map((s: any) => ({ keyword: s.keyword })), 'keyword').slice(0, 10);
  const topPages = countBy(pageViews, 'path').slice(0, 10);

  const productNamesInOrders = orders.flatMap((o: any) => o.items.map((i: any) => i.name));
  const purchased = countBy(productNamesInOrders.map((name: any) => ({ name })), 'name');
  const viewedNames = new Set(topProducts.map(p => p.name));
  const lowConversion = topProducts.filter(p => !purchased.find((x: any) => x.name === p.name)).slice(0, 5);
  const lowStock = products.filter((p: any) => p.stock <= 5).map((p: any) => ({ name: p.name, stock: p.stock }));

  const recommendations = [
    topSearches[0] ? `Đẩy campaign/SEO cho keyword “${topSearches[0].name}” vì đang được tìm nhiều.` : 'Cần thêm dữ liệu search để xác định nhu cầu nhập hàng.',
    zeroSearches[0] ? `Bổ sung sản phẩm hoặc synonym cho keyword không có kết quả: “${zeroSearches[0].name}”.` : 'Search hiện chưa có nhiều truy vấn lỗi.',
    lowConversion[0] ? `Sản phẩm “${lowConversion[0].name}” xem nhiều nhưng chưa mua: nên test giảm giá, bundle hoặc cải thiện ảnh/detail.` : 'Chưa thấy sản phẩm view cao nhưng chuyển đổi thấp.',
    lowStock[0] ? `Sản phẩm “${lowStock[0].name}” sắp hết hàng: ưu tiên nhập thêm hoặc chuyển sang preorder.` : 'Tồn kho hiện ổn.'
  ];

  return NextResponse.json({
    kpis: { sessions, pageViews: pageViews.length, productViews: productViews.length, cartAdds: cartAdds.length, orders: orders.length, revenue, conversionRate, aov, bannerClicks: bannerClicks.length },
    topProducts, topCartProducts, topSearches, zeroSearches, topPages, lowConversion, lowStock, recommendations
  });
}