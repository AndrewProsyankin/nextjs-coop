'use client'

import { useRouter } from 'next/navigation';

interface CartItem {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

interface CheckoutProps {
  items: CartItem[];
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ items, onRemove, onUpdateQuantity }) => {
  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            {/* Cart Items */}
            <h2 className="text-lg font-semibold mb-4">Items in Your Cart</h2>
            <ul>
              {items.map(item => (
                <li key={item.id} className="flex justify-between items-center border-b py-4">
                  <div className="flex items-center">
                    <img src={item.imageUrl} alt={item.name} className="h-16 w-16 object-cover rounded mr-4" />
                    <div>
                      <h3 className="text-md font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <div className="flex items-center mt-2">
                        <input
                          type="number"
                          value={item.quantity}
                          min="1"
                          onChange={(e) => onUpdateQuantity(item.id, Number(e.target.value))}
                          className="w-16 border rounded-md py-1 px-2 mr-2"
                        />
                        <button
                          onClick={() => onRemove(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">${item.price.toFixed(2)}</div>
                </li>
              ))}
            </ul>

            {/* Cart Summary */}
            <div className="mt-6 border-t pt-4">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mb-4">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="mt-6">
              <button 
                className="w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700"
                onClick={() => {
                  // Handle your checkout logic here (e.g., save order, redirect to payment)
                  router.push('/thank-you'); // Redirect to a thank-you or confirmation page
                }}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow mt-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          © 2024 Your Company Name. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Checkout;
