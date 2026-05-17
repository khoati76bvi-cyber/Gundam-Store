'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';

export default function SmartSearchBox({compact=false}:{compact?:boolean}){
  const [q,setQ]=useState('');
  const [suggestions,setSuggestions]=useState<string[]>([]);
  const [open,setOpen]=useState(false);
  const params = useMemo(()=> new URLSearchParams(q ? {q} : {}).toString(),[q]);
  useEffect(()=>{
    const t=setTimeout(async()=>{
      if(!q.trim()){setSuggestions([]);return;}
      const res=await fetch(`/api/search?q=${encodeURIComponent(q)}&pageSize=5`,{cache:'force-cache'});
      const data=await res.json();
      setSuggestions(data.suggestions || []); setOpen(true);
    },180);
    return ()=>clearTimeout(t);
  },[q]);
  return <div className={`relative ${compact?'w-full':'flex-1'}`}>
    <div className="flex">
      <input value={q} onChange={e=>setQ(e.target.value)} onFocus={()=>setOpen(true)} className="w-full border border-white/10 bg-white/5 rounded-l-xl px-4 text-white outline-none" placeholder="Tìm MG Freedom, RG, Ver.Ka, panel line..." />
      {q && <button onClick={()=>setQ('')} className="bg-white/10 px-2"><X size={16}/></button>}
      <Link href={`/search?${params}`} className="bg-brand text-white p-3 rounded-r-xl"><Search/></Link>
    </div>
    {open && suggestions.length>0 && <div className="absolute top-12 left-0 right-0 z-[80] rounded-2xl border border-white/10 bg-[#080b14] shadow-2xl overflow-hidden">
      {suggestions.map(s=><Link key={s} href={`/search?q=${encodeURIComponent(s)}`} className="block px-4 py-3 hover:bg-white/10 text-sm">{s}</Link>)}
    </div>}
  </div>
}
