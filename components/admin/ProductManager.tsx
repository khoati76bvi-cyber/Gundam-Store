
'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ImageUploadField from './ImageUploadField';

type Product = any;
const empty = { slug:'', name:'', category:'MG', grade:'', price:0, compareAt:0, stock:0, image:'/products/freedom.svg', gallery:'[]', badge:'', status:'ACTIVE', featured:false, description:'', specs:'{}' };
export default function ProductManager(){
  const [rows,setRows]=useState<Product[]>([]); const [form,setForm]=useState<Product>(empty); const [editing,setEditing]=useState<number|null>(null); const [q,setQ]=useState('');
  async function load(){ const r=await fetch('/api/admin/products',{cache:'no-store'}); setRows(await r.json()); }
  useEffect(()=>{load()},[]);
  function set(k:string,v:any){ setForm((f:any)=>({...f,[k]:v})); }
  async function save(e:React.FormEvent){ e.preventDefault(); const url=editing?`/api/admin/products/${editing}`:'/api/admin/products'; await fetch(url,{method:editing?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); setForm(empty); setEditing(null); load(); }
  function edit(r:any){ setForm({...empty,...r}); setEditing(r.id); scrollTo({top:0,behavior:'smooth'}); }
  async function remove(id:number){ if(confirm('Xóa sản phẩm?')){ await fetch(`/api/admin/products/${id}`,{method:'DELETE'}); load(); }}
  const data=rows.filter(r=>JSON.stringify(r).toLowerCase().includes(q.toLowerCase()));
  return <div>
    <div className="flex flex-col md:flex-row md:justify-between gap-4"><div><h1 className="text-3xl font-black">Products CMS</h1><p className="text-white/55">Upload ảnh, quản lý tồn kho, SEO/specs và trạng thái sản phẩm.</p></div><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search product..." className="rounded-xl bg-white/10 border border-white/10 px-4 py-3" /></div>
    <form onSubmit={save} className="mt-6 grid lg:grid-cols-3 gap-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <div className="lg:col-span-1"><ImageUploadField value={form.image} onChange={url=>set('image',url)} folder="products" label="Main product image" /></div>
      <div className="lg:col-span-2 grid md:grid-cols-2 gap-4">
        {['slug','name','grade','badge'].map(k=><label key={k}><span className="text-xs uppercase text-cyan-200/70">{k}</span><input value={form[k]??''} onChange={e=>set(k,e.target.value)} className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3" /></label>)}
        <label><span className="text-xs uppercase text-cyan-200/70">Category</span><select value={form.category} onChange={e=>set('category',e.target.value)} className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3"><option>HG</option><option>RG</option><option>MG</option><option>PG</option><option>Tools</option><option>Paint</option></select></label>
        <label><span className="text-xs uppercase text-cyan-200/70">Status</span><select value={form.status} onChange={e=>set('status',e.target.value)} className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3"><option>ACTIVE</option><option>DRAFT</option><option>ARCHIVED</option></select></label>
        {['price','compareAt','stock'].map(k=><label key={k}><span className="text-xs uppercase text-cyan-200/70">{k}</span><input type="number" value={form[k]??0} onChange={e=>set(k,Number(e.target.value))} className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3" /></label>)}
        <label className="flex items-center gap-2 mt-8"><input type="checkbox" checked={!!form.featured} onChange={e=>set('featured',e.target.checked)} /> Featured</label>
        <label className="md:col-span-2"><span className="text-xs uppercase text-cyan-200/70">Description / Content</span><textarea value={form.description??''} onChange={e=>set('description',e.target.value)} className="mt-2 h-28 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3" /></label>
        <label className="md:col-span-2"><span className="text-xs uppercase text-cyan-200/70">Specs JSON</span><textarea value={form.specs??'{}'} onChange={e=>set('specs',e.target.value)} className="mt-2 h-20 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3" /></label>
      </div>
      <div className="lg:col-span-3 flex gap-3"><button className="rounded-xl bg-cyan-300 px-5 py-3 font-black text-black">{editing?'Update':'Create'} Product</button>{editing&&<button type="button" onClick={()=>{setEditing(null);setForm(empty)}} className="rounded-xl bg-white/10 px-5 py-3">Cancel</button>}</div>
    </form>
    <div className="mt-6 overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.03]"><table className="w-full text-sm"><thead className="bg-white/[0.06]"><tr><th className="p-3 text-left">Image</th><th className="p-3 text-left">Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th className="p-3 text-right">Actions</th></tr></thead><tbody>{data.map(r=><tr key={r.id} className="border-t border-white/10"><td className="p-3"><div className="relative h-14 w-14"><Image src={r.image} alt="" fill className="object-contain" /></div></td><td className="p-3 font-bold">{r.name}</td><td>{r.category}</td><td>{Number(r.price).toLocaleString('vi-VN')}đ</td><td className={r.stock<10?'text-red-300 font-bold':''}>{r.stock}</td><td>{r.status}</td><td className="p-3 text-right"><button onClick={()=>edit(r)} className="mr-2 rounded-lg bg-white/10 px-3 py-2">Edit</button><button onClick={()=>remove(r.id)} className="rounded-lg bg-red-500/20 px-3 py-2 text-red-200">Delete</button></td></tr>)}</tbody></table></div>
  </div>
}
