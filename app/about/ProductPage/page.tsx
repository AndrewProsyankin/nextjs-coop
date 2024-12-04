'use client';

import ProductsList from '@/app/components/ProductsLists';
import useSWR from 'swr';
import { useCart } from '@/app/components/CartContext';
import { Product, CartItem } from '@/app/types';


const fetcher = (url: string): Promise<Product[]> => fetch(url).then((res) => res.json());

export default function ProductsPage() {
  const { data: products, error, isLoading } = useSWR<Product[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
    fetcher,
    { revalidateOnFocus: true }
  );

  const { cartItems} = useCart();

  if (error) {
    return <div>Ошибка при загрузке данных.</div>;
  }

  if (isLoading || !products) {
    return <div>Загрузка продуктов...</div>;
  }


  return (
    <main>
      <CartUpdater products={products} cartItems={cartItems}  />
      <ProductsList products={products} />
    </main>
  );
}

interface CartUpdaterProps {
  products: Product[];
  cartItems: CartItem[];
  
}

const CartUpdater = ({ products, cartItems }: CartUpdaterProps) => {
  const filteredCartItems = cartItems.filter((cartItem) =>
    products.some((product) => product.id === cartItem.id)
  );


    if (typeof window !== 'undefined') {
      localStorage.setItem('cartItems', JSON.stringify(filteredCartItems));
    }
  

  return null;
};
