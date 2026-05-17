"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Slide = {
  id: number;
  title: string;
  subtitle?: string;
  mediaType?: string;
  desktopMedia?: string;
  mobileMedia?: string;
  image?: string;
  linkUrl?: string;
  ctaHref?: string;
  buttonText?: string;
  ctaText?: string;
  openNewTab?: boolean;
  autoplayMs?: number;
};

function mediaFor(slide: Slide) {
  return slide.desktopMedia || slide.image || "/banners/hero1.png";
}
function hrefFor(slide: Slide) {
  return slide.linkUrl || slide.ctaHref || "/";
}
function ctaFor(slide: Slide) {
  return slide.buttonText || slide.ctaText || "Xem ngay";
}

export default function AdvancedBannerSlider({ slides }: { slides: Slide[] }) {
  const data = useMemo(() => (slides?.length ? slides : []), [slides]);
  const [index, setIndex] = useState(0);
  const current = data[index];
  useEffect(() => {
    if (data.length <= 1) return;
    const ms = current?.autoplayMs || 4500;
    const t = setTimeout(() => setIndex((i) => (i + 1) % data.length), ms);
    return () => clearTimeout(t);
  }, [index, data.length, current?.autoplayMs]);
  if (!current) return null;
  return (
    <section className="container mt-4">
      <div className="relative overflow-hidden rounded-[28px] min-h-[520px] border border-white/10 bg-[#05070d] shadow-2xl">
        <div className="absolute inset-0 particles" />
        {data.map((slide, i) => {
          const src = mediaFor(slide);
          const type =
            slide.mediaType ||
            (src.endsWith(".mp4") || src.endsWith(".webm") ? "video" : "image");
          const visible = i === index;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-700 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
            >
              {type === "video" ? (
                <video
                  src={src}
                  className="h-full w-full object-cover opacity-70"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <picture>
                  <source
                    media="(max-width: 768px)"
                    srcSet={slide.mobileMedia || src}
                  />
                  <img
                    src={src}
                    alt={slide.title}
                    className="h-full w-full object-cover opacity-70"
                  />
                </picture>
              )}
            </div>
          );
        })}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="relative z-10 flex min-h-[520px] items-center p-7 md:p-12">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-[var(--theme-primary)]/40 bg-white/10 px-4 py-2 text-sm font-black text-white">
              MEDIA BANNER CMS
            </div>
            <h1 className="mt-6 text-4xl md:text-7xl font-black leading-[.92] tracking-tight">
              {current.title}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/80">
              {current.subtitle}
            </p>
            <div className="mt-7 flex flex-wrap gap-4">
              <Link
                href={hrefFor(current)}
                target={current.openNewTab ? "_blank" : undefined}
                className="btn btn-red glow-btn"
              >
                {ctaFor(current)}
              </Link>
              <button
                onClick={() => setIndex((index + 1) % data.length)}
                className="btn glass"
              >
                Slide tiếp ›
              </button>
            </div>
            <div className="mt-8 flex gap-2">
              {data.map((s, i) => (
                <button
                  aria-label={`Slide ${i + 1}`}
                  key={s.id}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${i === index ? "w-12 bg-[var(--theme-primary)]" : "w-4 bg-white/35"}`}
                />
              ))}
            </div>
          </div>
        </div>
        <Link
          href={hrefFor(current)}
          target={current.openNewTab ? "_blank" : undefined}
          className="absolute inset-0 z-[1]"
          aria-label={current.title}
        />
        <div className="relative z-10 pointer-events-none" />
      </div>
    </section>
  );
}
