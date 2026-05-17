import { products } from './products';

export type SearchFilters = {
  q?: string;
  category?: string;
  grade?: string;
  min?: number;
  max?: number;
  sort?: string;
  page?: number;
  pageSize?: number;
};

const normalize = (value = '') => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

const synonyms: Record<string, string[]> = {
  freedom: ['strike freedom', 'mgex freedom', 'seed'],
  mg: ['master grade', '1/100'],
  rg: ['real grade', '1/144'],
  hg: ['high grade', '1/144'],
  rx78: ['rx-78', 'rx 78', 'unleashed'],
  tool: ['tools', 'nipper', 'godhand', 'dung cu'],
  paint: ['son', 'panel line', 'tamiya']
};

function scoreProduct(product: any, rawQuery: string) {
  const q = normalize(rawQuery);
  if (!q) return 1;
  const searchable = normalize([
    product.name,
    product.slug,
    product.category,
    product.brand,
    product.badge,
    ...(synonyms[normalize(product.category)] || [])
  ].join(' '));
  const tokens = q.split(/\s+/).filter(Boolean);
  let score = 0;
  if (searchable.includes(q)) score += 30;
  for (const token of tokens) {
    if (searchable.includes(token)) score += 10;
    for (const [key, values] of Object.entries(synonyms)) {
      if (token === key || values.some(v => normalize(v).includes(token))) {
        if (searchable.includes(key) || values.some(v => searchable.includes(normalize(v)))) score += 6;
      }
    }
  }
  if (normalize(product.name).startsWith(q)) score += 20;
  if (product.badge === 'HOT' || product.badge === 'BEST') score += 2;
  return score;
}

export function searchProducts(filters: SearchFilters) {
  const page = Math.max(Number(filters.page || 1), 1);
  const pageSize = Math.min(Math.max(Number(filters.pageSize || 12), 1), 48);
  let rows = products.map(p => ({ ...p, searchScore: scoreProduct(p, filters.q || '') }))
    .filter(p => !filters.q || p.searchScore > 0)
    .filter(p => !filters.category || filters.category === 'all' || normalize(p.category) === normalize(filters.category))
    .filter(p => !filters.grade || filters.grade === 'all' || normalize(p.category) === normalize(filters.grade))
    .filter(p => filters.min == null || p.price >= Number(filters.min))
    .filter(p => filters.max == null || p.price <= Number(filters.max));

  if (filters.sort === 'price-asc') rows.sort((a,b)=>a.price-b.price);
  else if (filters.sort === 'price-desc') rows.sort((a,b)=>b.price-a.price);
  else if (filters.sort === 'newest') rows.sort((a,b)=>b.id-a.id);
  else if (filters.sort === 'rating') rows.sort((a,b)=>b.rating-a.rating);
  else rows.sort((a,b)=>b.searchScore-a.searchScore || b.rating-a.rating);

  const total = rows.length;
  const totalPages = Math.max(Math.ceil(total/pageSize), 1);
  const items = rows.slice((page-1)*pageSize, page*pageSize);
  const suggestions = buildSuggestions(filters.q || '');
  return { items, total, page, pageSize, totalPages, suggestions };
}

export function buildSuggestions(q = '') {
  const query = normalize(q);
  const base = products.flatMap(p => [p.name, p.category, p.brand, p.badge]).filter(Boolean) as string[];
  const custom = ['MG Freedom', 'RG Hi-Nu', 'Ver Ka', 'Strike Freedom', 'Panel line', 'GodHand Nipper', 'Action Base', 'Limited', 'Pre-order'];
  return Array.from(new Set([...base, ...custom]))
    .filter(s => !query || normalize(s).includes(query))
    .slice(0, 8);
}
