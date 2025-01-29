'use client';

import ProductsList from '@/app/components/Lists/ProductsLists';
import useSWR from 'swr';
import { useCart } from '@/app/hooks/useCart';
import { Product, CartItem } from '@/app/types';


const fetcher = (url: string): Promise<Product[]> => fetch(url).then((res) => res.json());

export default function ProductsPage() {
  const { data: products } = useSWR<Product[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
    fetcher,
    { revalidateOnFocus: true }
    
  );
  const { cartItems } = useCart();

  return (
    <main>
      <CartUpdater products={products} cartItems={cartItems} />
      <ProductsList products={products} />
    </main>
  );
}

interface CartUpdaterProps {
  products: Product[];
  cartItems: CartItem[];
}

const CartUpdater = ({ products, cartItems }: CartUpdaterProps) => {
  if (!products) 
    return null;
  
  const filteredCartItems = cartItems.filter((cartItem) =>
    products.some((product) => product.id === cartItem.id)
  );

  if (typeof window !== 'undefined') {
    localStorage.setItem('cartItems', JSON.stringify(filteredCartItems));
  }

  return null;
};
