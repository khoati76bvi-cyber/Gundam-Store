# GundamStore Dynamic Theme + Advanced Banner CMS Final

Bản này đã combine toàn bộ foundation trước đó và bổ sung thêm:

## Frontend

- Homepage premium cinematic
- Advanced hero slider lấy dữ liệu từ CMS
- Banner hỗ trợ ảnh, GIF/WebP động, MP4/WebM video
- Desktop banner và mobile banner riêng
- Mỗi banner có link URL, CTA text, sort order, active/inactive, autoplay time
- Theme động bằng CSS variables
- Bật/tắt section homepage từ CMS
- Responsive desktop/tablet/mobile

## CMS/Admin

Mở tại:

```bash
http://localhost:3000/admin
```

Module mới:

```bash
/admin/theme
```

Cho phép:

- Đổi theme preset: GUNDAM_DARK / CYBER_NEON / PREMIUM_BLACK / LIGHT_CLEAN
- Đổi màu chính, màu phụ, background, panel
- Đổi kiểu layout cơ bản
- Bật/tắt section homepage: hero, USP, best seller, filter, collection, community, news

```bash
/admin/banners
```

Cho phép:

- Upload banner media
- Chọn media type: image / gif / webp / video
- Desktop media riêng
- Mobile media riêng
- Gắn link vào banner
- CTA button riêng
- Kéo thứ tự bằng sort order
- Bật/tắt banner
- Set thời gian tự chuyển slide

## Chạy local

```bash
cd gundamstore-full
cp .env.example .env
npm install
npm run setup
npm run dev
```

Mở web:

```bash
http://localhost:3000
```

Mở CMS:

```bash
http://localhost:3000/admin
```

## Lưu ý production

Hiện upload media đang lưu local vào `public/uploads`. Khi deploy production thật nên đổi sang Cloudinary hoặc Supabase Storage để ảnh/video không bị mất khi redeploy.

## Performance + Smart Search Upgrade

Bản này đã bổ sung lớp tối ưu tốc độ và tìm kiếm:

### Tốc độ

- `next.config.mjs`: bật AVIF/WebP, cache ảnh, CDN remote pattern Cloudinary/Supabase, compression.
- `OptimizedImage`: lazy load ảnh, responsive sizes, hỗ trợ priority cho ảnh above-the-fold.
- API cache: `/api/search` và `/api/products` dùng `s-maxage` + `stale-while-revalidate`.
- Pagination: search/listing không cần load toàn bộ catalog.
- Skeleton loading: `app/loading.tsx`.

### Tìm kiếm

- `/search`: smart search UI, filter grade/category, sort giá/rating/mới nhất.
- `/api/search`: API search có cache.
- `components/search/SmartSearchBox.tsx`: autocomplete/suggestion realtime.
- `lib/search.ts`: search ranking, synonym matching, normalizer tiếng Việt.

### Gợi ý production

Khi catalog lớn hơn khoảng 2.000 SKU, nên kết nối thêm Meilisearch hoặc Algolia. Hiện bản local đã có cấu trúc để thay `lib/search.ts` bằng search engine thật.

### Kiểm tra tốc độ

Sau khi chạy:

```bash
npm run build
npm run start
```

Mở Chrome DevTools > Lighthouse để đo Performance, SEO, Best Practices.
