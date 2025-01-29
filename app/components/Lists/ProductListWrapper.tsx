'use client';

import React from 'react';
import { useConvertedPrice } from '@/app/components/Currency/CurrencyContext';
import ProductList from './ProductList';
import { Product } from '@/app/types';

interface ProductListWrapperProps {
  products: Product[];
  onDelete: (id: number) => void;
  onAddPhoto: (id: number) => void;
  onOpenGallery: (productId: number) => void;
}

const ProductListWrapper: React.FC<ProductListWrapperProps> = (props) => {
  const { getConvertedPrice, selectedCurrency } = useConvertedPrice();

  return (
    <ProductList
      {...props}
      getConvertedPrice={getConvertedPrice}
      selectedCurrency={selectedCurrency}
    />
  );
};

export default ProductListWrapper;
