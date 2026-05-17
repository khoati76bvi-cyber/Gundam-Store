
'use client';
import { useEffect, useMemo, useState } from 'react';

type Field = { key: string; label: string; type?: 'text'|'number'|'textarea'|'checkbox'|'select'; options?: string[]; placeholder?: string };
type Props = { title: string; endpoint: string; fields: Field[]; columns: string[]; initial?: Record<string, any> };

function emptyFrom(fields: Field[], initial?: Record<string, any>) {
  const base: Record<string, any> = {};
  fields.forEach(f => base[f.key] = f.type === 'checkbox' ? false : f.type === 'number' ? 0 : '');
  return { ...base, ...(initial ?? {}) };
}

export default function AdminCrud({ title, endpoint, fields, columns, initial }: Props) {
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState<Record<string, any>>(emptyFrom(fields, initial));
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');

  async function load() {
    setLoading(true);
    const res = await fetch(endpoint, { cache: 'no-store' });
    const json = await res.json();
    setRows(Array.isArray(json) ? json : []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => rows.filter(r => JSON.stringify(r).toLowerCase().includes(q.toLowerCase())), [rows, q]);

  function patch(key: string, value: any, type?: string) {
    if (type === 'number') value = Number(value);
    if (type === 'checkbox') value = Boolean(value);
    setForm(v => ({ ...v, [key]: value }));
  }

  function startEdit(row: any) {
    const next: Record<string, any> = {};
    fields.forEach(f => next[f.key] = row[f.key] ?? (f.type === 'checkbox' ? false : f.type === 'number' ? 0 : ''));
    setForm(next); setEditingId(row.id); window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${endpoint}/${editingId}` : endpoint;
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setForm(emptyFrom(fields, initial)); setEditingId(null); await load();
  }

  async function remove(id: number) {
    if (!confirm('Xóa item này?')) return;
    await fetch(`${endpoint}/${id}`, { method: 'DELETE' });
    await load();
  }

  return <div>
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div><h1 className="text-3xl font-black">{title}</h1><p className="text-white/55 mt-1">Thêm, sửa, xóa dữ liệu CMS.</p></div>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search..." className="rounded-xl bg-white/10 border border-white/10 px-4 py-3 outline-none" />
    </div>

    <form onSubmit={save} className="mt-6 grid md:grid-cols-3 gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      {fields.map(f => <label key={f.key} className={f.type === 'textarea' ? 'md:col-span-3' : ''}>
        <span className="text-xs uppercase tracking-widest text-cyan-200/70">{f.label}</span>
        {f.type === 'textarea' ? <textarea value={form[f.key] ?? ''} onChange={e=>patch(f.key,e.target.value,f.type)} placeholder={f.placeholder} className="mt-2 h-28 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none" /> :
        f.type === 'checkbox' ? <div className="mt-4"><input type="checkbox" checked={!!form[f.key]} onChange={e=>patch(f.key,e.target.checked,f.type)} /> <span className="ml-2 text-white/70">Active / Enabled</span></div> :
        f.type === 'select' ? <select value={form[f.key] ?? ''} onChange={e=>patch(f.key,e.target.value,f.type)} className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none">{(f.options??[]).map(o=><option className="bg-[#070b16]" key={o} value={o}>{o}</option>)}</select> :
        <input type={f.type === 'number' ? 'number' : 'text'} value={form[f.key] ?? ''} onChange={e=>patch(f.key,e.target.value,f.type)} placeholder={f.placeholder} className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none" />}
      </label>)}
      <div className="md:col-span-3 flex gap-3">
        <button className="rounded-xl bg-cyan-300 px-5 py-3 font-black text-black hover:bg-cyan-200">{editingId ? 'Update' : 'Create'}</button>
        {editingId && <button type="button" onClick={()=>{setEditingId(null);setForm(emptyFrom(fields, initial));}} className="rounded-xl bg-white/10 px-5 py-3 font-bold">Cancel</button>}
      </div>
    </form>

    <div className="mt-6 overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.03]">
      <table className="w-full text-sm"><thead className="bg-white/[0.06]"><tr>{columns.map(c=><th key={c} className="px-4 py-3 text-left text-white/60">{c}</th>)}<th className="px-4 py-3 text-right">Actions</th></tr></thead>
      <tbody>{loading ? <tr><td className="p-5" colSpan={columns.length+1}>Loading...</td></tr> : filtered.map(row => <tr key={row.id} className="border-t border-white/10 hover:bg-white/[0.04]">{columns.map(c=><td key={c} className="px-4 py-3 max-w-[260px] truncate">{typeof row[c] === 'boolean' ? (row[c] ? 'Yes':'No') : String(row[c] ?? '')}</td>)}<td className="px-4 py-3 text-right whitespace-nowrap"><button onClick={()=>startEdit(row)} className="mr-2 rounded-lg bg-white/10 px-3 py-2 hover:bg-cyan-300/20">Edit</button><button onClick={()=>remove(row.id)} className="rounded-lg bg-red-500/20 px-3 py-2 text-red-200 hover:bg-red-500/30">Delete</button></td></tr>)}</tbody></table>
    </div>
  </div>
}
