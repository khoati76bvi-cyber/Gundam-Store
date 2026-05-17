
export function AdminCard({ title, value, hint }: { title: string; value: string | number; hint?: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-xl">
    <p className="text-sm text-white/50">{title}</p>
    <h3 className="mt-2 text-3xl font-black text-white">{value}</h3>
    {hint && <p className="mt-2 text-xs text-cyan-200/70">{hint}</p>}
  </div>
}
