import { ProductGridSkeleton } from '@/components/Skeleton';
export const dynamic = 'force-dynamic';
export default function Loading() { return <main className="container mt-8"><div className="premium-panel p-6 animate-pulse h-48" /><div className="mt-8"><ProductGridSkeleton /></div></main> }
