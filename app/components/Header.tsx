'use client';

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import Cart from '../about/Cart/page';
import { useCart } from './CartContext';
import Image from 'next/image';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems } = useCart();
  const [totalItemsCount, setTotalItemsCount] = useState(0); // Состояние для количества элементов в корзине

  // Эффект для обновления количества элементов в корзине
  useEffect(() => {
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    setTotalItemsCount(count);
  }, [cartItems]); // Обновляем при изменении cartItems

  const toggleCart = () => {
    setIsCartOpen((prevState) => !prevState);
  };

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <Dialog open={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} className="relative z-40 lg:hidden">
        {/* Dialog backdrop and content */}
      </Dialog>

      <header className="relative bg-white">
        <p className="flex h-10 items-center justify-center bg-[#3178c6] px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
          Get free delivery on orders over $100
        </p>

        <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <a href="#">
                <Image
                  alt=""
                  src="/images/LOGO.jpg"
                  className="h-13 w-30 mx-auto rounded-lg"
                  width={80}
                  height={80}
                />
                </a>
              </div>

              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
              >
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Cart Icon */}
              <div className="ml-auto flex items-center">
                <button
                  onClick={toggleCart}
                  className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <ShoppingBagIcon className="h-6 w-6" aria-hidden="true" />
                  {/* Cart items count */}
                  {totalItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                      {totalItemsCount} {/* Total items count */}
                    </span>
                  )}
                </button>

                {/* Render Cart component when cart is open */}
                {isCartOpen && <Cart />}
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header;
