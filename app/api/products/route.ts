import { NextResponse } from 'next/server';
import { products } from '@/lib/products';
export const revalidate = 300;
export async function GET(){
  return NextResponse.json({items: products, total: products.length}, {headers:{'Cache-Control':'s-maxage=300, stale-while-revalidate=600'}});
}
