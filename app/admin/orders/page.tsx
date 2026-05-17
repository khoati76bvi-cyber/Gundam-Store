
'use client';
import { useEffect, useState } from 'react';
import { formatVND } from '@/lib/format';
const statuses = ['NEW','CONFIRMED','PACKING','SHIPPING','COMPLETED','CANCELLED'];
export default function OrdersPage() {
  const [orders,setOrders]=useState<any[]>([]);
  async function load(){ const r=await fetch('/api/admin/orders',{cache:'no-store'}); setOrders(await r.json()); }
  useEffect(()=>{load()},[]);
  async function update(id:number, status:string){ await fetch(`/api/admin/orders/${id}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({status})}); load(); }
  return <div><h1 className="text-3xl font-black">Orders</h1><p className="text-white/60 mt-2">Quản lý trạng thái đơn hàng.</p>
    <div className="mt-6 overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.03]"><table className="w-full text-sm"><thead className="bg-white/[0.06]"><tr>{['Code','Customer','Phone','Total','Status','Payment','Date'].map(h=><th key={h} className="px-4 py-3 text-left text-white/60">{h}</th>)}</tr></thead><tbody>{orders.map(o=><tr key={o.id} className="border-t border-white/10"><td className="px-4 py-3 font-bold text-cyan-200">{o.code}</td><td className="px-4 py-3">{o.customerName}<br/><span className="text-white/45">{o.customerEmail}</span></td><td className="px-4 py-3">{o.phone}</td><td className="px-4 py-3">{formatVND(o.total)}</td><td className="px-4 py-3"><select value={o.status} onChange={e=>update(o.id,e.target.value)} className="rounded-lg bg-black/40 border border-white/10 px-3 py-2">{statuses.map(s=><option className="bg-[#070b16]" key={s}>{s}</option>)}</select></td><td className="px-4 py-3">{o.paymentMethod} / {o.paymentStatus}</td><td className="px-4 py-3">{new Date(o.createdAt).toLocaleDateString('vi-VN')}</td></tr>)}</tbody></table></div>
  </div>
}
