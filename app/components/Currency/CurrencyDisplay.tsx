'use client';

import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useCurrencyRates } from '@/app/hooks/useCurrencyRates';
import { useConvertedPrice } from '@/app/components/Currency/CurrencyContext';
import { Menu } from '@headlessui/react';

const CurrencyDisplay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currencyObject } = useCurrencyRates();
  const { selectedCurrency, setSelectedCurrency } = useConvertedPrice();

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const handleCurrencySelect = (currencyCode: string) => {
    setSelectedCurrency(currencyCode); 
    closeDropdown();
  };

  return (
    <div className="relative max-w-7.2xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-center space-x-8">
        <div className="h-6 w-6 cursor-pointer" aria-hidden="true">
          {/* Dropdown Menu */}
          <Menu as="div" className="absolute top-0 right-0">
            <Menu.Button 
              onClick={toggleDropdown}
              className="inline-flex items-center px-3  text-sm font-semibold text-gray-500 hover:bg-gray-50"
              aria-expanded={isOpen}
              aria-haspopup="true"
            >
              {selectedCurrency}
              <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
            </Menu.Button>
            {isOpen && (
              <div
                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
                onMouseLeave={closeDropdown}
              >
                <ul
                  className="max-h-64 overflow-y-auto divide-y divide-gray-100 bg-white"
                  style={{ scrollbarWidth: "thin", scrollbarColor: "#D1D5DB #F3F4F6" }}
                >
                  {Object.keys(currencyObject).map((key) => (
                    <li
                      key={key}
                      onClick={() => handleCurrencySelect(key)}
                      className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {currencyObject[key].Name}: {currencyObject[key].Value.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default CurrencyDisplay;
