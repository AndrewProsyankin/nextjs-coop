'use client';
import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/app/components/CartContext';
import Image from 'next/image';

export default function Cart() {
  const [open, setOpen] = useState(true);
  const { cartItems, removeFromCart, updateCartItem } = useCart(); // Destructure removeFromCart from context

  const handleOpen = () => {
    setOpen((prevState) => !prevState);
  };

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel className="pointer-events-auto w-screen max-w-md transform transition">
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-lg font-medium text-gray-900">Shopping cart</DialogTitle>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                    >
                      <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="mt-8">
                    <ul className="-my-6 divide-y divide-gray-200">
                      {cartItems.map((product) => (
                        <li key={product.id} className="flex py-6">
                          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <Image
                              alt={product.imageAlt}
                              src={product.imageSrc}
                              className="h-full w-full object-cover object-center"
                              width={500} 
                              height={500}
                            />
                          </div>

                          <div className="ml-4 flex flex-1 flex-col">
                          <div className="flex justify-between font-semibold text-gray-900">
                            <h3>{product.name}</h3>
                            <div className="ml-4 flex flex-col items-end">
                              <p>${(product.price * product.quantity).toFixed(2)}</p>
                              <p className="mt-2 text-sm text-gray-600">Price ${product.price}</p>
                            </div>
                          </div>

                          <input
                            type="number"
                            value={product.quantity}
                            min="1"
                            onChange={(e) => updateCartItem(product.id, Number(e.target.value))}
                            className="w-16 border rounded-md py-1 px-2 mr-2"
                            style={{ color: 'gray' }}
                          />
                            <div className="flex items-end justify-between text-sm">
                              <button
                                type="button"
                                onClick={() => removeFromCart(product.id)} 
                                className="font-medium text-[#6E4C1EFF] hover:text-[#98730C]"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>${subtotal.toFixed(2)}</p>
                  </div>
                  <div className="mt-6">
                    <a
                      href="/about/Checkout"
                      className="flex items-center justify-center rounded-md bg-[#6E4C1EFF] px-6 py-3 text-base font-medium text-white hover:bg-[#98730C]"
                    >
                      Checkout
                    </a>
                  </div>
                  <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                    <button onClick={handleOpen} className="font-medium text-[#6E4C1EFF] hover:text-[#6E4C1EFF]">
                      Continue Shopping &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}