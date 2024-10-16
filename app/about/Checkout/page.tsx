'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/components/CartContext';
import Image from 'next/image';

const Checkout: React.FC = () => {
  const { cartItems, removeFromCart, updateCartItem } = useCart(); 
  const [isMounted, setIsMounted] = useState(false); // Проверка рендеринга на клиенте
  const router = useRouter();

  // Включаем рендеринг только после того, как компонент смонтирован на клиенте
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Пока компонент не смонтирован на клиенте, ничего не рендерим
  }

  const calculateTotal = () => {
    return cartItems?.length ? cartItems.reduce((total, item) => total + item.price * item.quantity, 0) : 0;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Items in Your Cart</h2>
            <div>
              {cartItems?.length ? (
                cartItems.map(item => (
                  <div key={item.id} className="flex flex-col md:flex-row justify-between items-center border-b border-gray-100  py-4 text-gray-600">
                    <div className="flex items-center">
                      <Image
                        src={item.imageSrc}
                        alt={item.imageAlt}
                        className="h-16 w-16 object-cover rounded mr-4"                              
                        width={500} 
                        height={500}
                      />
                      <div>
                        <h3 className="text-md font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">Color: {item.color}</p>
                        <div className="flex items-center mt-2">
                          <input
                            type="number"
                            value={item.quantity}
                            min="1"
                            onChange={(e) => updateCartItem(item.id, Number(e.target.value))}
                            className="w-16 border rounded-md py-1 px-2 mr-2"
                          />
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="text-lg font-semibold text-gray-900 mt-4 md:mt-0">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>
                ))
              ) : (
                <p>Your cart is empty.</p>
              )}
            </div>

            <div className="mt-6 border-t pt-4">
              <h2 className="text-lg font-semibold mb-4 text-blue-700">Order Summary</h2>
              <div className="flex justify-between mb-2 text-blue-700">
                <span>Subtotal</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mb-4 text-blue-800">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                className="w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700"
                onClick={() => {
                  router.push('/thank-you');
                }}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white shadow mt-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          © 2024 Your Company Name. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Checkout;
