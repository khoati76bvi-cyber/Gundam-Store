# User Analytics & Behavior Intelligence Upgrade

Bản này đã combine thêm hệ thống đo lường hành vi người dùng để đưa chiến lược bán hàng.

## Có gì mới

- Theo dõi page view, product view, product click, add to cart, buy now, banner click, search keyword.
- Đo session, conversion rate, AOV, doanh thu, top viewed product, top add-to-cart, top search, search không có kết quả.
- Dashboard chiến lược tại `/admin/analytics`.
- API tracking tại `/api/analytics/track`.
- API tổng hợp analytics tại `/api/admin/analytics`.
- Gợi ý chiến lược tự động: nhập hàng, SEO/campaign, sản phẩm cần cải thiện, tồn kho thấp.

## Ghi chú production

Dữ liệu hiện lưu bằng SQLite để chạy local dễ nhất. Khi deploy thật nên chuyển sang PostgreSQL/Supabase và thêm consent banner/cookie policy.
