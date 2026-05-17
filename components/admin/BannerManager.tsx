'use client';
import { useEffect, useState } from 'react';
import ImageUploadField from './ImageUploadField';

type Banner = any;
const empty = { title:'', subtitle:'', mediaType:'image', desktopMedia:'/banners/hero1.svg', mobileMedia:'', linkUrl:'/', buttonText:'Xem ngay', position:'HOME_HERO', autoplayMs:4500, sortOrder:1, openNewTab:false, active:true };

export default function BannerManager(){
  const [rows,setRows]=useState<Banner[]>([]); const [form,setForm]=useState<any>(empty); const [editing,setEditing]=useState<number|null>(null);
  async function load(){ setRows(await (await fetch('/api/admin/banners',{cache:'no-store'})).json()); }
  useEffect(()=>{load()},[]);
  function patch(k:string,v:any){ setForm((f:any)=>({...f,[k]:v})) }
  function edit(r:any){ setEditing(r.id); setForm({...empty,...r}); window.scrollTo({top:0,behavior:'smooth'}); }
  async function save(e:React.FormEvent){ e.preventDefault(); const url=editing?`/api/admin/banners/${editing}`:'/api/admin/banners'; await fetch(url,{method:editing?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); setEditing(null); setForm(empty); load(); }
  async function del(id:number){ if(!confirm('Xóa banner này?')) return; await fetch(`/api/admin/banners/${id}`,{method:'DELETE'}); load(); }
  return <div>
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"><div><h1 className="text-3xl font-black">Advanced Banner Media Manager</h1><p className="text-white/55">Ảnh, GIF/WebP động, video MP4/WebM, link riêng, CTA riêng, desktop/mobile riêng và slide tự chạy.</p></div></div>
    <form onSubmit={save} className="mt-6 grid lg:grid-cols-2 gap-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <div className="space-y-4">
        <label><span className="text-xs uppercase tracking-widest text-cyan-200/70">Title</span><input value={form.title} onChange={e=>patch('title',e.target.value)} className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3" /></label>
        <label><span className="text-xs uppercase tracking-widest text-cyan-200/70">Subtitle</span><textarea value={form.subtitle} onChange={e=>patch('subtitle',e.target.value)} className="mt-2 h-24 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3" /></label>
        <div className="grid md:grid-cols-2 gap-4">
          <label><span className="text-xs uppercase tracking-widest text-cyan-200/70">Media Type</span><select value={form.mediaType} onChange={e=>patch('mediaType',e.target.value)} className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3"><option>image</option><option>gif</option><option>webp</option><option>video</option></select></label>
          <label><span className="text-xs uppercase tracking-widest text-cyan-200/70">Position</span><select value={form.position} onChange={e=>patch('position',e.target.value)} className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3"><option>HOME_HERO</option><option>HOME_PROMO</option><option>PRODUCT_TOP</option><option>COLLECTION_TOP</option></select></label>
        </div>
        <div className="grid md:grid-cols-2 gap-4"><label><span className="text-xs uppercase tracking-widest text-cyan-200/70">Link URL</span><input value={form.linkUrl} onChange={e=>patch('linkUrl',e.target.value)} className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3" /></label><label><span className="text-xs uppercase tracking-widest text-cyan-200/70">CTA Text</span><input value={form.buttonText} onChange={e=>patch('buttonText',e.target.value)} className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3" /></label></div>
        <div className="grid md:grid-cols-2 gap-4"><label><span className="text-xs uppercase tracking-widest text-cyan-200/70">Autoplay ms</span><input type="number" value={form.autoplayMs} onChange={e=>patch('autoplayMs',Number(e.target.value))} className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3" /></label><label><span className="text-xs uppercase tracking-widest text-cyan-200/70">Sort Order</span><input type="number" value={form.sortOrder} onChange={e=>patch('sortOrder',Number(e.target.value))} className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3" /></label></div>
        <div className="flex gap-6"><label><input type="checkbox" checked={!!form.active} onChange={e=>patch('active',e.target.checked)} /> <span className="ml-2">Active</span></label><label><input type="checkbox" checked={!!form.openNewTab} onChange={e=>patch('openNewTab',e.target.checked)} /> <span className="ml-2">Open new tab</span></label></div>
      </div>
      <div className="space-y-4"><ImageUploadField value={form.desktopMedia} onChange={u=>patch('desktopMedia',u)} folder="banners" label="Desktop banner media" /><ImageUploadField value={form.mobileMedia} onChange={u=>patch('mobileMedia',u)} folder="banners" label="Mobile banner media" /><button className="w-full rounded-xl bg-cyan-300 px-5 py-3 font-black text-black">{editing?'Update Banner':'Create Banner'}</button>{editing&&<button type="button" onClick={()=>{setEditing(null);setForm(empty)}} className="w-full rounded-xl bg-white/10 px-5 py-3 font-bold">Cancel</button>}</div>
    </form>
    <div className="mt-6 overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.03]"><table className="w-full text-sm"><thead className="bg-white/[0.06]"><tr>{['Title','Type','Position','Media','Link','Sort','Active','Actions'].map(h=><th className="px-4 py-3 text-left text-white/60" key={h}>{h}</th>)}</tr></thead><tbody>{rows.map(r=><tr key={r.id} className="border-t border-white/10"><td className="px-4 py-3 font-bold">{r.title}</td><td className="px-4 py-3">{r.mediaType}</td><td className="px-4 py-3">{r.position}</td><td className="px-4 py-3 max-w-[220px] truncate">{r.desktopMedia || r.image}</td><td className="px-4 py-3 max-w-[180px] truncate">{r.linkUrl}</td><td className="px-4 py-3">{r.sortOrder}</td><td className="px-4 py-3">{r.active?'Yes':'No'}</td><td className="px-4 py-3 whitespace-nowrap"><button onClick={()=>edit(r)} className="mr-2 rounded-lg bg-white/10 px-3 py-2">Edit</button><button onClick={()=>del(r.id)} className="rounded-lg bg-red-500/20 px-3 py-2 text-red-200">Delete</button></td></tr>)}</tbody></table></div>
  </div>
}
