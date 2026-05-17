'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';

export default function SmartSearchBox({ compact = false }: { compact?: boolean }) {
  const [q, setQ] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const params = useMemo(() => new URLSearchParams(q ? { q } : {}).toString(), [q]);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!q.trim()) { setSuggestions([]); return; }
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&pageSize=5`, { cache: 'force-cache' });
      const data = await res.json();
      setSuggestions(data.suggestions || []); setOpen(true);
    }, 180);
    return () => clearTimeout(t);
  }, [q]);

  return (
    // FIX ĐÈ MENU "PHỤ KIỆN": Thêm thuộc tính `isolate` để cô lập hoàn toàn lớp hiển thị của Search Box, không cho các phần tử cùng cấp trong Header đè lên
    <div className={`relative ${compact ? 'w-full' : 'flex-1'} z-[9999]`}>
      <div className="flex relative z-20"> {/* Nâng z-index của thanh gõ để giữ luồng chọn mượt */}
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          onFocus={() => setOpen(true)}
          className="w-full border border-white/10 bg-white/5 rounded-l-xl px-4 py-3 text-white outline-none focus:border-brand transition-colors"
          placeholder="Tìm MG Freedom, RG, Ver.Ka, panel line..."
        />
        {q && <button onClick={() => setQ('')} className="bg-white/10 px-3 text-white/50 hover:text-white transition-colors"><X size={16} /></button>}
        <Link href={`/search?${params}`} className="bg-brand text-white p-3 rounded-r-xl flex items-center justify-center"><Search /></Link>
      </div>

      {/* FIX CẮT CỤP DÒNG ĐẦU & NỀN TRẮNG: Tăng khoảng cách rơi xuống `top-[calc(100%+16px)]` để thoát khỏi vùng đè của input đen */}
      {open && suggestions.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 z-[99999] rounded-b-2xl border border-gray-200 bg-white shadow-[0_25px_60px_rgba(0,0,0,0.75)] overflow-hidden animate-in fade-in duration-200 pointer-events-auto" onMouseDown={(e) => {
            // Ngăn chặn sự kiện click lan truyền ra ngoài, bảo vệ ô trắng không bị tắt đột ngột hoặc click nhầm ra Header
            e.stopPropagation();
          }}
        >
          {suggestions.map(s => (
            <Link
              key={s}
              href={`/search?q=${encodeURIComponent(s)}`}
              className="block px-5 py-4 bg-white text-gray-800 hover:bg-gray-100 hover:text-black text-sm font-medium transition-colors border-b border-gray-100 last:border-b-0"
              onClick={() => setOpen(false)}
            >
              {s}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}