'use client';

import ProductsList from '@/app/components/ProductsLists';
import useSWR from 'swr';
import { useCart } from '@/app/components/CartContext';
import { Product, CartItem } from '@/app/types';
import  LoadingSpinner  from "@/app/components/LoadingSpinner"; 

const fetcher = (url: string): Promise<Product[]> => fetch(url).then((res) => res.json());

export default function ProductsPage() {
  const { data: products, error, isLoading } = useSWR<Product[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
    fetcher,
    { revalidateOnFocus: true }
  );

  const { cartItems } = useCart();

  if (error) {
    return <div>Error: Failed to load products</div>; 
  }

  if (isLoading || !products) {
    return (
      <div className="bg-gray-100 min-h-screen py-8">
        <h1 className="text-center text-gray-800 text-2xl font-bold-italic mb-8">Loading...</h1>
        <LoadingSpinner isLoading={true} color="bg-blue-500" text="Loading products..." />
      </div>
    );
  }

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
  const filteredCartItems = cartItems.filter((cartItem) =>
    products.some((product) => product.id === cartItem.id)
  );
  if (typeof window !== 'undefined') {
    localStorage.setItem('cartItems', JSON.stringify(filteredCartItems));
  }
  return null;
};
