import './global.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import { prisma } from '@/lib/db';
import { getThemeStyle } from '@/components/ThemeProvider';
import { Suspense } from 'react';
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker';

export const metadata = { title: 'GundamStore Vietnam', description: 'Premium Gundam model kit ecommerce platform' };

async function getSettings() {
  try {
    const rows = await prisma.setting.findMany();
    return Object.fromEntries(rows.map((r: any) => [r.key, r.value]));
  } catch { return {}; }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return <html lang="vi"><body style={getThemeStyle(settings)}>
    <Suspense fallback={null}><AnalyticsTracker /></Suspense>
    <Header />
    {children}
    <Footer />
    <MobileBottomNav />
  </body></html>
}
