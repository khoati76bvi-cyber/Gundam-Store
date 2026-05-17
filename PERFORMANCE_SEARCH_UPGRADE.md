# Performance + Smart Search Upgrade

## What was added

1. Image performance
- Next.js AVIF/WebP output
- Lazy loading by default
- CDN-ready image config
- Responsive image sizes

2. API cache
- `/api/search`: 60s CDN cache + stale revalidate
- `/api/products`: 300s CDN cache + stale revalidate

3. Search UX
- Instant search suggestions
- Query normalizer
- Grade/category filter
- Price/rating/newest/relevance sort
- Pagination
- Search result count

4. Storefront UX
- Skeleton loading page
- Header search replaced by smart autocomplete search

5. Admin note
- `/admin/performance` documents optimization status and next production steps.

## Recommended next production stack

- Media: Cloudinary or Supabase Storage
- Search: Meilisearch for self-hosted, Algolia for SaaS
- Hosting: Vercel + Postgres/Supabase
- CDN: Vercel Edge / Cloudflare
- Monitoring: Vercel Analytics + Sentry
