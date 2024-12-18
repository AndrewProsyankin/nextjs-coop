'use client';

import ProductsList from '@/app/components/ProductsLists';
import useSWR from 'swr';
import { useCart } from '@/app/components/CartContext';
import { Product, CartItem } from '@/app/types';
import { motion } from 'framer-motion';

const fetcher = (url: string): Promise<Product[]> => fetch(url).then((res) => res.json());

export default function ProductsPage() {
  const { data: products, error, isLoading } = useSWR<Product[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
    fetcher,
    { revalidateOnFocus: true }
  );

  const { cartItems } = useCart();

  if (error) {
    return <div>Ошибка при загрузке данных.</div>;
  }

  if (isLoading || !products) {
    return (
      <div className="bg-gray-100 min-h-screen py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 5 }}
          className="t396__elem tn-elem tn-elem__5554222641677716455390"
          style={{
            width: '260px',
            height: '260px',
            position: 'absolute',
            top: '172px',
            left: '428.5px',
          }}
        >
          <div className="spinner-container">
            <div className="spinner-dots  text-gray-400">
              <div className="spinner-dot"></div>
              <div className="spinner-dot"></div>
              <div className="spinner-dot"></div>
              <div className="spinner-dot"></div>
            </div>
          </div>
        </motion.div>
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
