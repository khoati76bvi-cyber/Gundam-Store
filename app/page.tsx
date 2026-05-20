import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import USP from "@/components/USP";
import CommunityHub from "@/components/CommunityHub";
import AdvancedFilterPreview from "@/components/AdvancedFilterPreview";
import AdvancedBannerSlider from "@/components/AdvancedBannerSlider";
import { products } from "@/lib/products";
import prisma from '@/lib/prisma';
import { sectionEnabled } from "@/components/ThemeProvider";
import { dict } from "@/lib/i18n";
export const dynamic = 'force-dynamic';
async function getHomeData() {
  // 🌟 LỚP BẢO VỆ 1: Nếu khâu build của Vercel chưa nạp kịp biến môi trường, trả về giá trị rỗng ngay để pass build
  if (!process.env.DATABASE_URL) {
    return { settings: {}, banners: [] };
  }

  try {
    // 🌟 LỚP BẢO VỆ 2: Thêm .catch(() => []) vào từng lệnh gọi để tránh gây treo tiến trình build nếu DB lag
    const [settingsRows, banners] = await Promise.all([
      prisma.setting.findMany().catch(() => []),
      prisma.banner.findMany({
        where: { active: true, position: "HOME_HERO" },
        orderBy: { sortOrder: "asc" },
      }).catch(() => []),
    ]);

    return {
      settings: Object.fromEntries(settingsRows.map((s: any) => [s.key, s.value])),
      banners,
    };
  } catch {
    return { settings: {}, banners: [] };
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams?: { lang?: string };
}) {
  const { settings, banners } = await getHomeData();
  const lang = searchParams?.lang === "en" ? "en" : "vi";
  const t = dict[lang];

  return (
    <main>
      {sectionEnabled(settings, "hero") &&
        (banners.length > 0 ? (
          <AdvancedBannerSlider slides={banners as any[]} />
        ) : (
          <section className="relative flex min-h-[460px] items-center overflow-hidden bg-[#070A12]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_45%,rgba(239,68,68,0.12),transparent_45%),linear-gradient(180deg,#080B14_0%,#0B1020_60%,#050505_100%)]" />

            <div className="container relative grid min-h-[480px] items-center gap-4 py-10 md:grid-cols-[1fr_1.2fr]">
              <div>
                <p className="eyebrow">{t.premium}</p>

                <h1 className="mt-4 text-5xl font-black leading-none tracking-tight text-white md:text-6xl lg:text-7xl">
                  {t.heroTitle1}{" "}
                  <span className="text-red-600">{t.heroTitle2}</span>
                </h1>

                <p className="mt-6 max-w-xl text-lg text-gray-300">
                  {t.heroDesc}
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-5">
                  <Link
                    href="/category/mg"
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-red-700 px-8 py-4 text-base font-bold text-white shadow-[0_10px_35px_rgba(239,68,68,.45)] transition duration-300 hover:-translate-y-1 hover:scale-105"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      🔥 {t.buyNow}
                    </span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 transition duration-500 group-hover:opacity-100" />
                    <div className="absolute -left-10 top-0 h-full w-8 rotate-12 bg-white/30 blur-md transition-all duration-700 group-hover:left-[120%]" />
                  </Link>

                  <Link
                    href="/build-guide"
                    className="group rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-md transition duration-300 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 hover:shadow-[0_0_25px_rgba(239,68,68,.2)]"
                  >
                    <span className="flex items-center gap-2">
                      ⚡ {t.buildGuide}
                    </span>
                  </Link>
                </div>
              </div>

              <div className="relative flex justify-center">
                <div className="absolute inset-0 rounded-full bg-red-600/30 blur-3xl" />
                <Image
                  src="/banners/hero2.png"
                  alt="GundamStore hero"
                  width={1200}
                  height={800}
                  priority
                  className="relative w-full max-w-[860px] rounded-3xl object-cover shadow-2xl ring-1 ring-white/10 brightness-110 contrast-105 transition duration-700 hover:scale-[1.05] animate-float"
                />
              </div>
            </div>
          </section>
        ))}

      {sectionEnabled(settings, "usp") && <USP />}

      {sectionEnabled(settings, "featuredProducts") && (
        <section className="container py-12">
          <div className="section-head">
            <div>
              <p className="eyebrow">
                {lang === "en" ? "HOT DROP" : "SẢN PHẨM HOT"}
              </p>
              <h2 className="section-title !mt-1">{t.bestSeller}</h2>
            </div>
            <Link href="/category/mg">
              {lang === "en" ? "View all ›" : "Xem tất cả ›"}
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {products.slice(0, 5).map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </section>
      )}

      {sectionEnabled(settings, "advancedFilter") && <AdvancedFilterPreview />}

      {sectionEnabled(settings, "collections") && (
        <section className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">
                {lang === "en" ? "UNIVERSE COLLECTION" : "BỘ SƯU TẬP GUNDAM"}
              </p>
              <h2 className="section-title !mt-1">
                {lang === "en" ? "COLLECTION" : "DANH MỤC"}
              </h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-5">
            {["MG", "RG", "HG", "TOOLS", "PAINT"].map((c) => (
              <Link
                href={`/category/${c.toLowerCase()}`}
                className="collection-tile"
                key={c}
              >
                <Image
                  src={`/collections/${c.toLowerCase()}.svg`}
                  alt={c}
                  fill
                  className="object-cover opacity-70 transition duration-500 hover:scale-110"
                />
                <span className="relative text-3xl">{c}</span>
                <p className="relative mt-1 text-sm">
                  {lang === "en" ? "Shop now ›" : "Xem ngay ›"}
                </p>
              </Link>
            ))}
          </div>

          <h2 className="section-title">
            {lang === "en" ? "CAMPAIGN / PRE-ORDER" : "KHUYẾN MÃI / ĐẶT TRƯỚC"}
          </h2>

          <div className="grid gap-4 md:grid-cols-[1fr_1.2fr]">
            <Image
              src="/banners/promo.svg"
              alt="promo"
              width={800}
              height={240}
              className="w-full rounded-2xl hover-lift"
            />
            <Image
              src="/banners/combo.svg"
              alt="combo"
              width={800}
              height={240}
              className="w-full rounded-2xl hover-lift"
            />
          </div>
        </section>
      )}

      {sectionEnabled(settings, "community") && <CommunityHub />}

      {sectionEnabled(settings, "news") && (
        <section className="container">
          <h2 className="section-title">
            {lang === "en"
              ? "NEWS, GUIDE & BUILD LAB"
              : "TIN TỨC, HƯỚNG DẪN & BUILD LAB"}
          </h2>

          <div className="grid gap-4 md:grid-cols-4">
            {[
              lang === "en"
                ? "MG Freedom Gundam Ver.2.0 Review"
                : "Review MG Freedom Gundam Ver.2.0",
              lang === "en"
                ? "Detail painting guide"
                : "Hướng dẫn sơn chi tiết",
              lang === "en" ? "MG vs RG comparison" : "So sánh MG vs RG",
              lang === "en" ? "Top essential tools" : "Top dụng cụ cần có",
            ].map((n, i) => (
              <div className="card p-3 hover-lift" key={n}>
                <Image
                  src={`/news/news${i + 1}.svg`}
                  alt={n}
                  width={400}
                  height={220}
                  className="rounded-xl"
                />
                <b>{n}</b>
                <p className="text-sm text-gray-500">20/05/2026</p>
              </div>
            ))}
          </div>

          <div className="premium-panel my-8 flex flex-col justify-between gap-4 p-6 md:flex-row">
            <div>
              <b className="text-2xl">
                {lang === "en"
                  ? "SUBSCRIBE FOR EXCLUSIVE OFFERS"
                  : "ĐĂNG KÝ NHẬN TIN ƯU ĐÃI"}
              </b>
              <p className="text-gray-400">
                {lang === "en"
                  ? "Get new arrivals, pre-orders, limited drops, and build guides."
                  : "Nhận sản phẩm mới, preorder, limited drop và build guide."}
              </p>
            </div>

            <div className="flex">
              <input
                className="rounded-l-xl px-4 text-black"
                placeholder={
                  lang === "en" ? "Your email..." : "Email của bạn..."
                }
              />
              <button className="btn btn-red rounded-l-none">
                {lang === "en" ? "SUBSCRIBE" : "ĐĂNG KÝ"}
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
