'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function ImageUploadField({ value, onChange, folder='products', label='Media', accept='image/*,video/mp4,video/webm' }: { value: string; onChange: (url: string) => void; folder?: string; label?: string; accept?: string }) {
  const [busy, setBusy] = useState(false);
  async function upload(file?: File) {
    if (!file) return;
    setBusy(true);
    const fd = new FormData(); fd.append('file', file); fd.append('folder', folder);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const json = await res.json();
    if (json.url) onChange(json.url); else alert(json.error || 'Upload failed');
    setBusy(false);
  }
  const isVideo = value?.endsWith('.mp4') || value?.endsWith('.webm');
  return <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
    <div className="text-xs uppercase tracking-widest text-cyan-200/70 mb-2">{label}</div>
    {value ? <div className="relative h-40 overflow-hidden rounded-xl border border-white/10 bg-white/5 mb-3">{isVideo ? <video src={value} className="h-full w-full object-contain" controls /> : <Image src={value} alt="preview" fill className="object-contain" />}</div> : <div className="h-40 rounded-xl border border-dashed border-white/20 grid place-items-center text-white/40 mb-3">No media</div>}
    <input type="file" accept={accept} onChange={e=>upload(e.target.files?.[0])} className="block w-full text-sm text-white/70 file:mr-3 file:rounded-lg file:border-0 file:bg-cyan-300 file:px-3 file:py-2 file:font-bold file:text-black" />
    <input value={value || ''} onChange={e=>onChange(e.target.value)} placeholder="/uploads/banners/... hoặc URL" className="mt-3 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none" />
    {busy && <p className="mt-2 text-cyan-200 text-sm">Uploading...</p>}
  </div>
}
