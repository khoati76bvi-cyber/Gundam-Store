/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '*.supabase.co' }
    ]
  },
  experimental: { optimizePackageImports: ['lucide-react'] },
  poweredByHeader: false,
  compress: true
};
export default nextConfig;
