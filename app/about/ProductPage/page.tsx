'use client'
import ProductsList from '@/app/components/ProductsLists';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProductsPage() {
  const { data: products, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, fetcher);

  if (error) {
    return <div>Ошибка при загрузке данных.</div>;
  }

  return (
    <main>
      <ProductsList products={products || []} />
    </main>
  );
}
