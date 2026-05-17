export default function Page(){
  const items = [
    ['Image optimization','AVIF/WebP, lazy load, responsive sizes, remote CDN ready'],
    ['API cache','Search/products API có s-maxage và stale-while-revalidate'],
    ['Search quality','Instant suggestion, synonym matching, category/grade filter, sort'],
    ['Pagination','Không load toàn bộ sản phẩm trên listing/search'],
    ['UX loading','Skeleton loading cho page transition'],
    ['Production next step','Kết nối Meilisearch/Algolia khi catalog > 2.000 SKU']
  ];
  return <main><h1 className="text-3xl font-black">Performance & Search</h1><div className="grid md:grid-cols-2 gap-4 mt-6">{items.map(([a,b])=><div key={a} className="card p-5"><b>{a}</b><p className="text-gray-400 mt-2">{b}</p></div>)}</div></main>
}
