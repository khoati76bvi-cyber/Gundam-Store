"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ShoppingCart,
  User,
  ShieldCheck,
  Truck,
  Phone,
  Menu,
} from "lucide-react";
import { useCart } from "@/components/cart-store";
import SmartSearchBox from "@/components/search/SmartSearchBox";
import LanguageToggle from "@/components/LanguageToggle";

const nav = [
  "MG",
  "RG",
  "HG",
  "PG",
  "TOOLS",
  "PAINT",
  "ACCESSORIES",
  "PRE-ORDER",
  "SALE",
];

export default function Header() {
  const count = useCart((s) => s.items.reduce((a, b) => a + b.qty, 0));
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") === "en" ? "en" : "vi";

  const text = {
    vi: {
      authentic: "Chính hãng 100%",
      freeShip: "Miễn phí ship từ 1.000k",
      community: "Cộng đồng",
      compare: "So sánh",
      account: "Tài khoản",
      cart: "Giỏ hàng",
      home: "TRANG CHỦ",
      search: "Tìm MG Freedom, RG, Ver.Ka, panel line...",
    },
    en: {
      authentic: "100% Authentic",
      freeShip: "Free ship from 1,000k",
      community: "Community",
      compare: "Compare",
      account: "Account",
      cart: "Cart",
      home: "HOME",
      search: "Search MG Freedom, RG, Ver.Ka, panel line...",
    },
  }[lang];

  return (
    <>
      <div className="sticky top-0 z-50 bg-black/80 text-white text-xs backdrop-blur-xl border-b border-white/10">
        <div className="container flex justify-between py-2">
          <span className="flex gap-2">
            <ShieldCheck size={14} />
            {text.authentic}
          </span>

          <span className="hide-mobile flex gap-6">
            <b className="flex gap-2">
              <Truck size={14} />
              {text.freeShip}
            </b>
            <b className="flex gap-2">
              <Phone size={14} />
              0901 234 567
            </b>
          </span>
        </div>
      </div>

      <header className="bg-[#05070d]/95 text-white sticky top-0 z-50 shadow-xl backdrop-blur border-b border-white/10">
        <div className="container flex items-center gap-5 py-4">
          <Link href={`/?lang=${lang}`} className="text-3xl font-black italic">
            GUNDAM<span className="text-brand">STORE</span>
            <div className="text-[10px] tracking-[.25em] not-italic text-white/60">
              BUILD YOUR LEGEND
            </div>
          </Link>

          <div className="flex-1 hide-mobile">
            <SmartSearchBox />
          </div>

          <Link
            href={`/community?lang=${lang}`}
            className="hide-mobile text-sm font-bold hover:text-brand"
          >
            {text.community}
          </Link>

          <Link
            href={`/compare?lang=${lang}`}
            className="hide-mobile text-sm font-bold hover:text-brand"
          >
            {text.compare}
          </Link>

          <LanguageToggle />

          <Link href={`/account?lang=${lang}`} className="flex gap-2">
            <User />
            <span className="hide-mobile">{text.account}</span>
          </Link>

          <Link href={`/cart?lang=${lang}`} className="relative flex gap-2">
            <ShoppingCart />
            <span className="hide-mobile">{text.cart}</span>
            {count > 0 && (
              <b className="absolute -top-3 left-4 bg-brand text-white rounded-full text-xs px-2">
                {count}
              </b>
            )}
          </Link>

          <button className="md:hidden">
            <Menu />
          </button>
        </div>

        <nav className="bg-black">
          <div className="container flex overflow-auto">
            <Link
              href={`/?lang=${lang}`}
              className="text-white px-5 py-3 font-bold text-sm hover:bg-brand"
            >
              {text.home}
            </Link>

            {nav.map((n) => (
              <Link
                key={n}
                href={`/category/${n.toLowerCase()}?lang=${lang}`}
                className="text-white px-5 py-3 font-bold text-sm hover:bg-brand whitespace-nowrap"
              >
                {n}
              </Link>
            ))}
          </div>
        </nav>
      </header>
    </>
  );
}
