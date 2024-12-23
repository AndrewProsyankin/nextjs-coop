'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '@/app/components/CartContext';
import CustomImage from '@/app/components/CustomImage';
import { useEffect, useState } from 'react';

const Checkout: React.FC = () => {
  const { cartItems = [], removeFromCartOnDelete, updateCartItem } = useCart(); // Default to empty array
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const calculateTotal = () => {
    return cartItems.length ? cartItems.reduce((total, item) => total + item.price * item.quantity, 0) : 0;
  };

  if (!isClient) {
    return null; 
  }

  return (
    <>
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
                {cartItems.length ? (
                  cartItems.map(item => (
                    <div
                      key={item.id}
                      className="flex flex-col md:flex-row justify-between items-center border-b border-gray-100 py-4 text-gray-600"
                    >
                      <div className="flex items-center">
                        <CustomImage
                          image_url={item.image_url}
                          alt={item.name}
                          className="h-24 w-24 overflow-hidden rounded-md border border-gray-200 mr-4"
                          width={94.4}
                          height={94.4}
                        />
                        <div>
                          <h3 className="text-md font-medium text-gray-900">{item.name}</h3>
                          <div className="text-sm text-gray-600">Color: {item.color}</div>
                          <div className="flex items-center mt-2">
                            <input
                              type="number"
                              value={item.quantity}
                              min="1"
                              onChange={(e) => updateCartItem(item.id, Number(e.target.value))}
                              className="w-16 border rounded-md py-1 px-2 mr-2"
                              style={{ color: 'gray' }}
                            />
                            <button
                              onClick={() => removeFromCartOnDelete(item.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col font-semibold items-end">
                        <div>${(item.price * item.quantity).toFixed(2)}</div>
                        <div className="mt-2 text-sm text-gray-600">Price ${item.price}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-600">Your cart is empty.</div>
                )}
              </div>

              <div className="mt-6 border-t pt-4">
                <h2 className="text-lg font-semibold mb-4 text-gray-600">Order Summary</h2>
                <div className="flex justify-between mb-2 text-gray-600">
                  <span>Subtotal</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mb-4 text-gray-600">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-center mt-9">
                <button
                  className="bg-[#f0bd7a] text-white font-bold py-2 px-4 rounded-md hover:bg-[#eed9c1] w-full max-w-md"
                  onClick={() => router.push('/thank-you')}
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Checkout;
