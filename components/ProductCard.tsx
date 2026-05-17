"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Heart, Eye, GitCompare } from "lucide-react";
import { formatPrice } from "@/lib/products";
import { useCart } from "./cart-store";
import { trackEvent } from "@/components/analytics/AnalyticsTracker";

export default function ProductCard({ p }: { p: any }) {
  const add = useCart((s) => s.add);
  const oldPrice = p.oldPrice || p.compareAt;

  return (
    <div className="premium-product group relative overflow-hidden rounded-3xl bg-white p-4 shadow-xl transition duration-300 hover:-translate-y-2 hover:shadow-[0_0_35px_rgba(239,68,68,.28)]">
      <Link
        href={`/product/${p.slug}`}
        onClick={() =>
          trackEvent({
            type: "PRODUCT_CLICK",
            productId: p.id,
            productSlug: p.slug,
            productName: p.name,
          })
        }
      >
        <div className="product-image relative aspect-square overflow-hidden rounded-2xl bg-black">
          <Image
            src={p.image}
            alt={p.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-110"
          />

          <span
            className={`absolute left-3 top-3 badge ${
              String(p.badge).includes("PRE") ? "badge-blue" : ""
            }`}
          >
            {p.badge || "NEW"}
          </span>

          <div className="quick-actions">
            <button type="button">
              <Eye size={16} />
            </button>
            <button type="button">
              <GitCompare size={16} />
            </button>
            <button type="button">
              <Heart size={16} />
            </button>
          </div>

          {p.stock <= 5 && (
            <span className="absolute bottom-3 left-3 rounded-full bg-red-600/90 px-3 py-1 text-xs text-white animate-pulse">
              LAST STOCK
            </span>
          )}
        </div>

        <h3 className="mt-3 min-h-[56px] text-lg font-bold leading-tight text-black transition group-hover:text-red-600">
          {p.name}
        </h3>
      </Link>

      <div className="mt-2 text-xs text-yellow-500">
        ★★★★★ <span className="text-gray-500">({p.reviews || 25})</span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <b className="text-lg text-red-600">{formatPrice(p.price)}</b>
        {oldPrice ? (
          <del className="text-sm text-gray-400">{formatPrice(oldPrice)}</del>
        ) : null}
      </div>

      <div className="mt-2 text-xs text-gray-500">
        Collector score: {(p.rating * 20).toFixed(0)}/100 • {p.category}
      </div>

      <button
        type="button"
        onClick={() => {
          add(p.id);
          trackEvent({
            type: "ADD_TO_CART",
            productId: p.id,
            productSlug: p.slug,
            productName: p.name,
            value: p.price,
          });
        }}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-black py-3 font-bold text-white transition duration-300 hover:bg-red-600"
      >
        <ShoppingCart size={17} />
        Thêm nhanh
      </button>
    </div>
  );
}
