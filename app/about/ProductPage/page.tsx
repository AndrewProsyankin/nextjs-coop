'use client';
import productsData from '@/app/data/products.json';
import { useCart } from '@/app/components/CartContext';
import Header from '@/app/components/Header';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  imageSrc: string;
  imageAlt: string;
  quantity: number;
  color: string; 
}

const typedProductsData: Product[] = productsData as Product[];

export default function ProductPage() {
  const { addToCart, cartItems } = useCart();
  const [addedProducts, setAddedProducts] = useState<number[]>([]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setAddedProducts(prev => [...prev, product.id]);
  };


  useEffect(() => {
    const updatedAddedProducts = cartItems.map(item => item.id);
    setAddedProducts(updatedAddedProducts);
  }, [cartItems]);

  return (
    <div>
      <Header />
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-10">Desk and Office</h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {typedProductsData && typedProductsData.length > 0 && typedProductsData.map((product: Product) => (
              <div key={product.id} className="group">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                  <Image
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                    width={500} 
                    height={500}
                  />
                </div>
                <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">${product.price.toFixed(2)}</p>
                <div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`mt-4 w-full rounded-md px-4 py-2 text-sm font-medium text-white ${addedProducts.includes(product.id) ? 'bg-green-500' : 'bg-[#98730C] hover:bg-[#f0bd7a]'} `}
                    disabled={addedProducts.includes(product.id)}
                  >
                    {addedProducts.includes(product.id) ? (
                      <span>✓ Added</span>
                    ) : (
                      <span>Add to cart</span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
