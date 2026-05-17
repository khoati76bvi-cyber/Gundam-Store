import Image from 'next/image';
import Link from 'next/link';
import { Play, Sparkles, Zap } from 'lucide-react';

const slides = ['/banners/hero1.svg','/banners/hero2.svg','/banners/hero3.svg'];

export default function PremiumHero(){
  return <section className="container mt-4">
    <div className="hero-premium relative overflow-hidden rounded-[28px] border border-white/10 bg-[#05070d] min-h-[520px] text-white shadow-2xl">
      <div className="absolute inset-0 particles" />
      {slides.map((src,i)=><Image key={src} src={src} alt="Gundam hero" fill priority={i===0} className="heroSlide object-cover opacity-70" />)}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      <div className="relative z-10 grid lg:grid-cols-[1fr_.85fr] gap-6 p-7 md:p-12 items-center min-h-[520px]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-100"><Sparkles size={16}/> PREMIUM COLLECTOR DROP</div>
          <h1 className="mt-6 text-4xl md:text-7xl font-black leading-[.92] tracking-tight">MG FREEDOM<br/><span className="text-glow">GUNDAM VER.2.0</span></h1>
          <p className="mt-5 max-w-xl text-lg text-white/80">Cinematic Gundam shopping experience: model kit, tools, paint, preorder và cộng đồng builder trong một nền tảng.</p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link href="/product/mg-freedom-gundam-ver-2" className="btn btn-red glow-btn">MUA NGAY</Link>
            <Link href="/community" className="btn glass"><Play size={18}/> Xem showcase</Link>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-lg">
            {[['1.250.000đ','Giá hot'],['15','Tồn kho'],['4.9★','128 review']].map(([a,b])=><div className="glass rounded-2xl p-4" key={b}><b className="text-2xl text-red-400">{a}</b><p className="text-xs text-white/60">{b}</p></div>)}
          </div>
        </div>
        <div className="hidden lg:block relative h-[430px]">
          <div className="absolute inset-8 rounded-full bg-red-600/20 blur-3xl animate-pulse" />
          <Image src="/products/freedom.svg" alt="MG Freedom" fill className="object-contain floating" />
          <div className="absolute right-2 bottom-8 glass rounded-2xl p-4 max-w-[240px]"><b className="flex gap-2"><Zap className="text-red-400"/> Limited collector bonus</b><p className="text-sm text-white/70 mt-1">Tặng decal + gợi ý combo dụng cụ build.</p></div>
        </div>
      </div>
    </div>
  </section>
}
