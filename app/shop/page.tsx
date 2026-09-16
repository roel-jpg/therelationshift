import type { Metadata } from 'next';
import { getCurrentUser } from '@/lib/session';
import { ShopList } from '@/components/ShopList';
import { products } from '@/components/Books';

export const metadata: Metadata = { title: 'Shop', description: 'Books, movies, music and games we selected for couples doing The Relationshift® program.' };

export default async function ShopPage() {
  const user = await getCurrentUser();
  return <ShopList products={products} joinHref={user ? '/dashboard' : '/signup'} />;
}
