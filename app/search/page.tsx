import ProductCard from '@/components/ProductCard';
import SmartSearchBox from '@/components/search/SmartSearchBox';
import { searchProducts } from '@/lib/search';
import Link from 'next/link';

export const revalidate = 60;

export default function SearchPage({ searchParams }: { searchParams: Record<string,string|undefined> }){
  const q = searchParams.q || '';
  const category = searchParams.category || 'all';
  const sort = searchParams.sort || 'relevance';
  const page = Number(searchParams.page || 1);
  const data = searchProducts({ q, category, sort, page, pageSize: 12 });
  const cats = ['all','MG','RG','HG','PG','TOOLS','PAINT'];
  return <main className="container mt-8">
    <div className="premium-panel p-6">
      <p className="eyebrow">SMART SEARCH</p>
      <h1 className="text-3xl font-black">Tìm kiếm sản phẩm nhanh</h1>
      <p className="text-gray-400 mt-2">Hỗ trợ gợi ý nhanh, search theo grade/series/tag, sort và cache API.</p>
      <div className="mt-5 max-w-3xl"><SmartSearchBox compact/></div>
    </div>
    <div className="mt-6 grid lg:grid-cols-[260px_1fr] gap-6">
      <aside className="card p-4 h-fit sticky top-28">
        <b>Bộ lọc nhanh</b>
        <div className="mt-4 space-y-2">{cats.map(c=><Link key={c} href={`/search?q=${encodeURIComponent(q)}&category=${c}&sort=${sort}`} className={`block rounded-xl px-3 py-2 ${category===c?'bg-brand text-white':'bg-white/5 hover:bg-white/10'}`}>{c==='all'?'Tất cả':c}</Link>)}</div>
        <div className="mt-5"><b>Sắp xếp</b><div className="grid gap-2 mt-3">{[['relevance','Liên quan'],['price-asc','Giá thấp'],['price-desc','Giá cao'],['rating','Rating'],['newest','Mới nhất']].map(([v,label])=><Link key={v} href={`/search?q=${encodeURIComponent(q)}&category=${category}&sort=${v}`} className={`rounded-xl px-3 py-2 ${sort===v?'bg-brand text-white':'bg-white/5 hover:bg-white/10'}`}>{label}</Link>)}</div></div>
      </aside>
      <section>
        <div className="section-head"><div><p className="eyebrow">{data.total} kết quả</p><h2 className="section-title !mt-1">{q ? `Search: ${q}` : 'Sản phẩm nổi bật'}</h2></div></div>
        <div className="grid-products">{data.items.map(p=><ProductCard key={p.id} p={p}/>)}</div>
        <div className="flex justify-center gap-3 mt-8">
          {page>1 && <Link className="btn btn-dark" href={`/search?q=${encodeURIComponent(q)}&category=${category}&sort=${sort}&page=${page-1}`}>‹ Trước</Link>}
          <span className="btn btn-dark">Trang {data.page}/{data.totalPages}</span>
          {page<data.totalPages && <Link className="btn btn-red" href={`/search?q=${encodeURIComponent(q)}&category=${category}&sort=${sort}&page=${page+1}`}>Tiếp ›</Link>}
        </div>
      </section>
    </div>
  </main>
}
