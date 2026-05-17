export function ProductGridSkeleton(){
  return <div className="grid-products">{Array.from({length:8}).map((_,i)=><div key={i} className="premium-product animate-pulse"><div className="aspect-square rounded-2xl bg-white/10"/><div className="mt-4 h-4 bg-white/10 rounded"/><div className="mt-2 h-4 w-2/3 bg-white/10 rounded"/><div className="mt-4 h-10 bg-white/10 rounded-xl"/></div>)}</div>
}
