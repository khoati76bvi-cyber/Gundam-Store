'use client';
import { useEffect, useState } from 'react';
export const dynamic = 'force-dynamic';
const presets = ['GUNDAM_DARK', 'CYBER_NEON', 'PREMIUM_BLACK', 'LIGHT_CLEAN'];
const sections = [
  ['hero', 'Hero banner slider'], ['usp', 'USP benefits'], ['featuredProducts', 'Best seller products'],
  ['advancedFilter', 'Advanced filter preview'], ['collections', 'Collections & campaign'], ['community', 'Community showcase'], ['news', 'News / build lab']
];

const defaults: Record<string, string> = {
  'theme.preset': 'GUNDAM_DARK', 'theme.primary': '#ef233c', 'theme.accent': '#22d3ee', 'theme.bg': '#05070d', 'theme.panel': 'rgba(255,255,255,.055)',
  'layout.productCard': 'premium', 'layout.bannerStyle': 'cinematic',
  'section.hero': 'true', 'section.usp': 'true', 'section.featuredProducts': 'true', 'section.advancedFilter': 'true', 'section.collections': 'true', 'section.community': 'true', 'section.news': 'true'
};

export default function ThemeBuilderPage() {
  const [form, setForm] = useState(defaults); const [saved, setSaved] = useState(false);
  useEffect(() => { fetch('/api/admin/theme', { cache: 'no-store' }).then(r => r.json()).then(j => setForm({ ...defaults, ...j })) }, []);
  function patch(k: string, v: string | boolean) { setForm(f => ({ ...f, [k]: String(v) })); setSaved(false) }
  async function save() { await fetch('/api/admin/theme', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }); setSaved(true) }
  return <div>
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div><h1 className="text-3xl font-black">Dynamic Theme & Layout Builder</h1><p className="text-white/55 mt-1">Đổi màu, theme, layout và ẩn/hiện section homepage mà không cần sửa code.</p></div>
      <button onClick={save} className="rounded-xl bg-cyan-300 px-5 py-3 font-black text-black">Save & Publish</button>
    </div>
    {saved && <div className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4 text-emerald-100">Đã lưu. Refresh trang chủ để xem theme mới.</div>}
    <div className="mt-6 grid lg:grid-cols-[1fr_.9fr] gap-6">
      <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
        <h2 className="text-xl font-black">Theme preset</h2>
        <select value={form['theme.preset']} onChange={e => patch('theme.preset', e.target.value)} className="mt-3 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3">
          {presets.map(p => <option className="bg-[#070b16]" key={p}>{p}</option>)}
        </select>
        <div className="mt-5 grid md:grid-cols-2 gap-4">
          {[['theme.primary', 'Primary color'], ['theme.accent', 'Accent color'], ['theme.bg', 'Background'], ['theme.panel', 'Panel color']].map(([k, l]) => <label key={k}><span className="text-xs uppercase tracking-widest text-cyan-200/70">{l}</span><div className="mt-2 flex gap-2"><input type="color" value={form[k]?.startsWith('#') ? form[k] : '#000000'} onChange={e => patch(k, e.target.value)} className="h-12 w-16 rounded-xl bg-black" /><input value={form[k] || ''} onChange={e => patch(k, e.target.value)} className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3" /></div></label>)}
        </div>
        <h2 className="mt-8 text-xl font-black">Layout options</h2>
        <div className="mt-3 grid md:grid-cols-2 gap-4">
          <label><span className="text-xs uppercase tracking-widest text-cyan-200/70">Product card</span><select value={form['layout.productCard']} onChange={e => patch('layout.productCard', e.target.value)} className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3"><option>premium</option><option>compact</option><option>minimal</option></select></label>
          <label><span className="text-xs uppercase tracking-widest text-cyan-200/70">Banner style</span><select value={form['layout.bannerStyle']} onChange={e => patch('layout.bannerStyle', e.target.value)} className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3"><option>cinematic</option><option>split</option><option>full-width</option></select></label>
        </div>
      </section>
      <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
        <h2 className="text-xl font-black">Homepage sections</h2>
        <p className="text-white/55 mt-1">Tắt những block chưa cần dùng, bật lại bất cứ lúc nào.</p>
        <div className="mt-4 space-y-3">{sections.map(([key, label]) => <label key={key} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4"><span><b>{label}</b><p className="text-xs text-white/45">section.{key}</p></span><input type="checkbox" checked={form[`section.${key}`] === 'true'} onChange={e => patch(`section.${key}`, e.target.checked)} className="h-5 w-5" /></label>)}</div>
      </section>
    </div>
    <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <h2 className="text-xl font-black">Live preview style</h2>
      <div style={{ background: form['theme.bg'], color: '#fff' }} className="mt-4 overflow-hidden rounded-3xl border border-white/10 p-6">
        <div style={{ background: form['theme.panel'] }} className="rounded-2xl p-5"><p style={{ color: form['theme.accent'] }} className="font-black tracking-widest text-sm">GUNDAMSTORE</p><h3 className="mt-2 text-3xl font-black">Premium Collector Theme</h3><button style={{ background: form['theme.primary'] }} className="mt-4 rounded-xl px-5 py-3 font-black">CTA Button</button></div>
      </div>
    </section>
  </div>
}
