'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ShoppingBagIcon, BellIcon, UserIcon } from '@heroicons/react/24/outline';
import { useCart } from './CartContext';
import navbarCategories from '@/app/data/navbarCategories.json';
import Cart from '../about/Cart/page';
import { motion, AnimatePresence } from 'framer-motion';

const dropdownVariants = {
  open: {
    opacity: 1,
    height: 'auto',
    transition: { type: 'spring', stiffness: 200, damping: 20 }
  },
  closed: {
    opacity: 0,
    height: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  }
};

const Header = () => {
  const { cartItems } = useCart();
  const totalItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const [mounted, setMounted] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});



  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleCart = () => {
    setIsCartOpen((prevState) => !prevState);
  };
  const toggleMenu = (categoryLabel: string) => {
    setOpenMenus((prevOpenMenus) => ({
      ...prevOpenMenus,
      [categoryLabel]: !prevOpenMenus[categoryLabel]
    }));
  };

  return (
    <div className="bg-white">
      <header className="relative bg-white">
        <p className="flex h-10 items-center justify-center bg-[#6E4C1EFF] px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
          Get free delivery on orders over $100
        </p>

        <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between border-b border-gray-200 py-4">
            <div className="flex items-center">
              <a href="/" className="flex items-center">
                <Image
                  alt="Neurobilan logo"
                  src="/images/neurobilan.jpg"
                  className="h-16 w-16 rounded-lg"
                  width={64}
                  height={64}
                />
                <span className="ml-3 text-2xl font-bold text-gray-900">NEUROBILAN</span>
              </a>
            </div>

            <div className="hidden lg:flex space-x-8">
              {navbarCategories.map((category) => (
                <div key={category.label} className="relative">
                  <Menu as="div" className="relative">
                    <MenuButton
                      className="inline-flex items-center justify-center px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                      onClick={() => toggleMenu(category.label)}
                    >
                      {category.label}
                    </MenuButton>

                    <AnimatePresence>
                      {openMenus[category.label] && (
                        <motion.div
                          initial="closed"
                          animate="open"
                          exit="closed"
                          variants={dropdownVariants}
                          className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                        >
                          <MenuItems>
                            {category.items.map((item) => (
                              <MenuItem key={item.label}>
                                {({ active }) => (
                                  <a
                                    href={item.href}
                                    className={`block px-4 py-2 text-sm ${
                                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                    }`}
                                  >
                                    {item.label}
                                  </a>
                                )}
                              </MenuItem>
                            ))}
                          </MenuItems>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Menu>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-6">
              <div className="relative text-gray-400 hover:text-gray-500" onClick={toggleCart}>
                <ShoppingBagIcon className="h-6 w-6 cursor-pointer" aria-hidden="true" />
                {totalItemsCount > 0 && (
                  <div className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                    {totalItemsCount}
                  </div>
                )}
              </div>

              <button className="text-gray-400 hover:text-gray-500">
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              <button className="text-gray-400 hover:text-gray-500">
                <UserIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </nav>

        {/* Render the Cart dialog based on isCartOpen state */}
        {isCartOpen && <Cart />}
      </header>
    </div>
  );
};

export default Header;
