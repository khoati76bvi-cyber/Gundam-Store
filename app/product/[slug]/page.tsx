'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  BadgeCheck,
  Box,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Gift,
  Heart,
  MessageCircle,
  Minus,
  Play,
  Plus,
  RotateCw,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
  Users,
  Zap,
} from 'lucide-react';
import { products, formatPrice } from '@/lib/products';
import { useCart } from '@/components/cart-store';
import ProductCard from '@/components/ProductCard';
import { trackEvent } from '@/components/analytics/AnalyticsTracker';

type TabKey = 'description' | 'specs' | 'reviews' | 'guide' | 'qa';

const variants = ['MGEX', 'MG', 'RG', 'HG'];
const scales = ['1/100', '1/144', '1/60'];
const tabs: { key: TabKey; label: string }[] = [
  { key: 'description', label: 'Mô tả sản phẩm' },
  { key: 'specs', label: 'Thông số kỹ thuật' },
  { key: 'reviews', label: 'Đánh giá ảnh thật' },
  { key: 'guide', label: 'Hướng dẫn lắp ráp' },
  { key: 'qa', label: 'Hỏi đáp' },
];

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const p = products.find((x) => x.slug === params.slug);
  const add = useCart((s) => s.add);
  const [activeImage, setActiveImage] = useState(0);
  const [variant, setVariant] = useState('MGEX');
  const [scale, setScale] = useState('1/100');
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<TabKey>('description');
  const [quickAdded, setQuickAdded] = useState(false);

  useEffect(() => {
    if (p) {
      trackEvent({ type: 'PRODUCT_VIEW', productId: p.id, productSlug: p.slug, productName: p.name, value: p.price });
    }
  }, [p?.id]);

  if (!p) return notFound();

  const gallery = useMemo(() => [p.image, p.image, p.image, p.image, p.image], [p.image]);
  const tools = products.filter((x) => ['TOOLS', 'PAINT'].includes(x.category));
  const related = products.filter((x) => x.id !== p.id).slice(0, 4);

  function handleAddToCart(source = 'product_detail') {
    if (p?.id) {
      for (let i = 0; i < qty; i++) add(p.id);
    }
    setQuickAdded(true);
    window.setTimeout(() => setQuickAdded(false), 1800);
    trackEvent({ type: 'ADD_TO_CART', productId: p?.id, productSlug: p?.slug, productName: p?.name, value: p?.price });
    trackEvent({ type: 'CUSTOM_EVENT', eventName: source, productId: p?.id, productSlug: p?.slug, productName: p?.name, value: (p?.price || 0) * qty });
  }

  return (
    <main className="product-exp-page">
      <section className="container pt-5 pb-4">
        <div className="product-breadcrumb">Trang chủ › Master Grade › {p.name}</div>

        <div className="product-shell mt-4">
          <div className="product-gallery premium-panel p-4">
            <div className="gallery-main">
              <Image src={gallery[activeImage]} alt={p.name} fill className="object-cover gallery-img" priority />
              <span className="absolute left-4 top-4 badge">{p.badge || 'HOT'}</span>
              <span className="absolute left-4 top-14 badge badge-blue">NEW</span>
              <button className="gallery-arrow left-3" onClick={() => setActiveImage((v) => (v + gallery.length - 1) % gallery.length)}>
                <ChevronLeft size={18} />
              </button>
              <button className="gallery-arrow right-3" onClick={() => setActiveImage((v) => (v + 1) % gallery.length)}>
                <ChevronRight size={18} />
              </button>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="glass rounded-full px-4 py-2 flex items-center gap-2 text-sm"><RotateCw size={16} />360 preview</div>
                <button className="glass rounded-full px-4 py-2 flex items-center gap-2 text-sm"><Play size={16} />Video</button>
              </div>
            </div>
            <div className="gallery-thumbs">
              {gallery.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)} className={`thumb ${activeImage === i ? 'active' : ''}`}>
                  <Image src={img} alt={`thumb ${i + 1}`} fill className="object-cover" />
                  {i === 4 ? <span className="thumb-more">+8</span> : null}
                </button>
              ))}
            </div>
            <div className="share-row">
              <button>Chia sẻ</button><button>So sánh</button><button>Wishlist</button>
            </div>
          </div>

          <aside className="product-info">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="filter-chip">{p.category}</span>
              <span className="filter-chip">BANDAI</span>
              <span className="filter-chip">Collector</span>
            </div>
            <h1>{p.name}</h1>
            <p className="product-subtitle">Z.A.F.T Mobile Suit • Gunpla Premium Line • SKU GS-{p.id}</p>
            <div className="rating-row">
              <span>{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}</span>
              <b>{p.rating}</b>
              <em>({p.reviews} đánh giá)</em>
              <strong>256 đã bán</strong>
            </div>
            <div className="price-row">
              <b>{formatPrice(p.price)}</b>
              {p.oldPrice ? <del>{formatPrice(p.oldPrice)}</del> : <del>{formatPrice(Math.round(p.price * 1.12))}</del>}
              <span>-12%</span>
            </div>
            <div className="stock-row"><BadgeCheck size={17} /> Còn hàng • Giao 24h - 48h</div>

            <div className="trust-grid">
              <div><ShieldCheck size={18} />Hàng chính hãng 100%</div>
              <div><Truck size={18} />Miễn phí giao hàng từ 500k</div>
              <div><Clock size={18} />Đổi trả trong 7 ngày</div>
              <div><Gift size={18} />Tích điểm thành viên</div>
            </div>

            <Selector title="Phiên bản" options={variants} value={variant} onChange={setVariant} />
            <Selector title="Scale" options={scales} value={scale} onChange={setScale} />

            <div className="qty-row">
              <b>Số lượng</b>
              <div className="qty-control">
                <button onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={16} /></button>
                <span>{qty}</span>
                <button onClick={() => setQty(Math.min(9, qty + 1))}><Plus size={16} /></button>
              </div>
              <small>Còn {p.stock} sản phẩm</small>
            </div>

            <div className="cta-row">
              <button onClick={() => handleAddToCart()} className="btn btn-red flex-1"><ShoppingCart size={18} />THÊM VÀO GIỎ HÀNG</button>
              <Link onClick={() => handleAddToCart('buy_now')} href="/cart" className="btn btn-dark flex-1">MUA NGAY <small>(Giao nhanh 24h)</small></Link>
            </div>
            {quickAdded ? <div className="quick-toast">✓ Đã thêm {qty} sản phẩm vào giỏ hàng</div> : null}

            <div className="reward-box"><Sparkles size={18} /> Bạn sẽ nhận được <b>{Math.round(p.price / 1000)}</b> điểm thưởng khi mua sản phẩm này.</div>
          </aside>
        </div>
      </section>

      <section className="container product-content-grid">
        <div className="premium-panel p-6">
          <div className="tab-row">
            {tabs.map((t) => <button key={t.key} onClick={() => setTab(t.key)} className={tab === t.key ? 'active' : ''}>{t.label}</button>)}
          </div>
          <div className="tab-content">
            {tab === 'description' && <Description pName={p.name} />}
            {tab === 'specs' && <Specs />}
            {tab === 'reviews' && <ReviewPanel p={p} />}
            {tab === 'guide' && <GuidePanel />}
            {tab === 'qa' && <QaPanel />}
          </div>
        </div>
        <aside className="side-stack">
          <QuickAdd p={p} qty={qty} onAdd={() => handleAddToCart('quick_add_card')} />
          <VariantPreview activeVariant={variant} activeScale={scale} onVariant={setVariant} onScale={setScale} image={p.image} />
          <TrustPaymentBar />
        </aside>
      </section>

      <section className="container pb-10">
        <div className="section-head"><div><p className="eyebrow">BUILD GALLERY</p><h2 className="section-title mt-1">Hình ảnh & video cộng đồng</h2></div><Link href="/community">Xem cộng đồng →</Link></div>
        <div className="build-gallery-grid">
          <div className="build-card large"><Image src={p.image} alt="build" fill className="object-cover" /><button><Play /> Xem video build</button></div>
          {[1, 2, 3].map((i) => <div key={i} className="build-card"><Image src={p.image} alt="build" fill className="object-cover" /></div>)}
          <div className="build-card overlay"><Image src={p.image} alt="build" fill className="object-cover" /><span>+12 ảnh</span></div>
        </div>

        <div className="section-head"><div><p className="eyebrow">COMPLETE YOUR BUILD</p><h2 className="section-title mt-1">Combo gợi ý đi kèm</h2></div></div>
        <div className="grid-products">{[p, ...tools].slice(0, 4).map((x) => <ProductCard key={x.id} p={x} />)}</div>

        <div className="section-head"><div><p className="eyebrow">RECOMMENDED</p><h2 className="section-title mt-1">Sản phẩm liên quan</h2></div></div>
        <div className="grid-products">{related.map((x) => <ProductCard key={x.id} p={x} />)}</div>
      </section>

      <div className="mobile-sticky-cta">
        <div><b>{formatPrice(p.price)}</b><span>{p.name}</span></div>
        <button onClick={() => handleAddToCart('mobile_sticky')}><ShoppingCart size={18} />Thêm</button>
      </div>
    </main>
  );
}

function Selector({ title, options, value, onChange }: { title: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return <div className="selector-block"><b>{title}</b><div>{options.map((o) => <button key={o} onClick={() => onChange(o)} className={value === o ? 'active' : ''}>{o}</button>)}</div></div>;
}

function Description({ pName }: { pName: string }) {
  return <div className="grid md:grid-cols-[1fr_.8fr] gap-6"><div><p><b>{pName}</b> là phiên bản cao cấp dành cho collector, tập trung vào độ chi tiết, khung inner frame chắc chắn và khả năng tạo dáng linh hoạt.</p><ul className="product-bullets"><li>Chi tiết sắc nét, phù hợp trưng bày và chụp ảnh setup.</li><li>Khớp chuyển động ổn định, dễ tạo dáng hành động.</li><li>Phù hợp người chơi trung cấp, collector và fan Gunpla.</li><li>Gợi ý mua kèm: Action Base, Panel Liner, Nipper cao cấp.</li></ul></div><div className="feature-highlight"><Camera /><b>Build Gallery</b><p>Xem bộ sưu tập cộng đồng, ảnh build thật, custom paint và setup góc trưng bày.</p></div></div>;
}

function Specs() { return <div className="spec-grid">{[['Scale', '1/100'], ['Chất liệu', 'ABS / PS / POM'], ['Series', 'Gundam Seed / Universal'], ['Phụ kiện', 'Beam Rifle, Shield, Saber'], ['Phù hợp', 'Collector / Builder'], ['Xuất xứ', 'Nhật Bản']].map(([k, v]) => <div key={k}><span>{k}</span><b>{v}</b></div>)}</div>; }

function ReviewPanel({ p }: { p: any }) { return <div className="review-layout"><div className="review-score"><b>{p.rating}</b><span>/5</span><p>★★★★★</p><em>{p.reviews} đánh giá</em></div><div className="review-bars">{[5, 4, 3, 2, 1].map((n, i) => <div key={n}><span>{n}★</span><i><u style={{ width: `${88 - i * 18}%` }} /></i><em>{110 - i * 22}</em></div>)}</div><div className="review-card"><b>Minh Hoàng</b><p>Chi tiết đẹp, khớp ổn, lên đèn và decal nhìn rất đã. Đóng gói kỹ.</p><span>★★★★★</span></div></div>; }
function GuidePanel() { return <div className="guide-preview"><div><b>Hướng dẫn lắp ráp chi tiết</b><p>Checklist dụng cụ, thứ tự build, lưu ý cắt runner, xử lý decal và bảo quản mô hình.</p><Link href="/build-guide" className="btn btn-dark mt-4">Xem hướng dẫn</Link></div><div className="manual-card"><Box size={34} /><span>Manual Preview</span></div></div>; }
function QaPanel() { return <div className="qa-list">{['Sản phẩm có kèm action base không?', 'Shop có hỗ trợ kiểm tra runner trước khi giao không?', 'Có phù hợp người mới chơi MG không?'].map(q => <div key={q}><MessageCircle size={17} /><span>{q}</span></div>)}</div>; }

function QuickAdd({ p, qty, onAdd }: { p: any; qty: number; onAdd: () => void }) { return <div className="premium-panel p-4 quick-add-card"><b>Quick add to cart</b><div className="flex gap-3 mt-3"><div className="relative h-20 w-20 rounded-xl overflow-hidden bg-black"><Image src={p.image} alt={p.name} fill className="object-cover" /></div><div><b>{p.name}</b><p>{formatPrice(p.price)}</p><small>Số lượng: {qty}</small></div></div><button onClick={onAdd} className="btn btn-red w-full mt-4"><ShoppingCart size={17} />Thêm vào giỏ</button></div>; }
function VariantPreview({ image, activeVariant, activeScale, onVariant, onScale }: any) { return <div className="premium-panel p-4"><b>Product variants</b><div className="variant-images">{variants.map((v: string) => <button key={v} onClick={() => onVariant(v)} className={activeVariant === v ? 'active' : ''}><Image src={image} alt={v} fill className="object-cover" /><span>{v}</span></button>)}</div><div className="selector-block compact"><b>Scale</b><div>{scales.map((s: string) => <button key={s} onClick={() => onScale(s)} className={activeScale === s ? 'active' : ''}>{s}</button>)}</div></div></div>; }
function TrustPaymentBar() { return <div className="premium-panel p-4 trust-payment"><div><ShieldCheck />Hàng chính hãng</div><div><Truck />Giao nhanh 24h - 48h</div><div><CreditCard />COD / Ví điện tử / Chuyển khoản</div><div className="payment-logos"><span>VISA</span><span>MoMo</span><span>ZaloPay</span><span>COD</span></div></div>; }
