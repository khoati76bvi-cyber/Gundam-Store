"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const lang = params.get("lang") === "en" ? "en" : "vi";

  function changeLang(nextLang: string) {
    const next = new URLSearchParams(params.toString());
    next.set("lang", nextLang);
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <select
      value={lang}
      onChange={(e) => changeLang(e.target.value)}
      className="rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-sm font-bold text-white outline-none hover:border-red-500"
    >
      <option value="vi">🇻🇳 VI</option>
      <option value="en">🇺🇸 EN</option>
    </select>
  );
}
