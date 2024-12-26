'use client';

import React, { useState} from 'react';
import useSWR from 'swr';
import { useCart } from '@/app/components/CartContext';
import CustomImage from '@/app/components/CustomImage';
import dynamic from 'next/dynamic';
import { RadioGroup, Radio } from '@headlessui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

export interface Product {
  id: number;
  name: string;
  price: number;
  colors: [
    { name: 'White', class: 'bg-white', selectedClass: 'ring-gray-400' },
    { name: 'Gray', class: 'bg-gray-200', selectedClass: 'ring-gray-400' },
    { name: 'Black', class: 'bg-gray-900', selectedClass: 'ring-gray-900' }
  ];
  image_url: string ;
  imageAlt: string;
  imageSrc: string;
  isAvailable: boolean;
  stock_quantity: number;
  sizes: { name: string; inStock: boolean }[];
  additionalDetails?: AdditionalDetails;
}

export interface AdditionalDetails {
  weight?: string;
  dimensions?: string;
  manufacturer?: string;
  material?: string;
  careInstructions?: string;
  colors?: string[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const LoadingSpinner = dynamic(
  () => import('@/app/components/LoadingSpinner'),
  {
    ssr: false
  }
);

export default function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams || {};

  const { data: product, error, isLoading } = useSWR<Product>(
    id ? `/api/products/${id}` : null,
    fetcher,
    { revalidateOnFocus: true }
  );

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const { addToCart, cartItems } = useCart();
  const isInCart = product && cartItems.some((item) => item.id === product.id);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  if (error) return <p>Failed to load product details.</p>;
  if (isLoading || !product)
    return (
      <div className="p-8 max-w-4xl mx-auto bg-gray-100">
        <LoadingSpinner isLoading={true} color="blue" text="Loading products..." />
      </div>
    );

  const productWithDefaults = {
    ...product,
    imageAlt: product.imageAlt || 'Default alt text',
    imageSrc: product.imageSrc || product.image_url,
  };

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <div className="bg-white">
      <div className="pt-6">
        {/* Main Container with Two Columns */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-12">
          <Swiper
            className="mySwiper"
            modules={[Navigation]}
            navigation
            style={{ width: '100%', height: '100%' }}
          >
            {Array.from({ length: 9 }, (_, index) => (
              <SwiperSlide key={index} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CustomImage
                  alt={`Product image ${index + 1}`}
                  image_url={product.image_url[index] || ''}  
                  className="aspect-[2/3] w-full h-full max-h-[calc(100vh-200px)] rounded-lg bg-gray-100 object-cover"
                  width={400}
                  height={400}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
  
          {/* Product Info Section */}  
          <div className="w-full lg:w-1/2">
            <div className="text-left px-8 lg:px-32">
              <h1 className="text-3xl font-bold text-gray-900">{productWithDefaults.name}</h1>
              <p className="text-lg font-medium text-gray-600">
                ${typeof productWithDefaults.price === "number" ? productWithDefaults.price.toFixed(2) : "N/A"}
              </p>
              <p className="mt-4 text-gray-700">
                Stock: {productWithDefaults.stock_quantity > 0 ? productWithDefaults.stock_quantity : "Out of stock"}
              </p>
  
              <div className="mt-6 text-gray-600">
                <h3 className="text-xl font-semibold mb-2">Additional Details:</h3>
                <p><strong>Weight:</strong> {product.additionalDetails?.weight || "N/A"}</p>
                <p><strong>Dimensions:</strong> {product.additionalDetails?.dimensions || "N/A"}</p>
                <p><strong>Manufacturer:</strong> {product.additionalDetails?.manufacturer || "N/A"}</p>
                <p><strong>Material:</strong> {product.additionalDetails?.material || "N/A"}</p>
              </div>
  
              {/* Color and Size Options */}
              <fieldset className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Color</h3>
                <RadioGroup value={selectedColor} onChange={setSelectedColor} className="flex items-center gap-x-3">
                  {product.colors?.map((color) => (
                    <Radio
                      key={color.name}
                      value={color.name}
                      aria-label={color.name}
                      className={classNames(
                        color.selectedClass,
                        "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none data-[checked]:ring-2 data-[focus]:data-[checked]:ring data-[focus]:data-[checked]:ring-offset-1"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={classNames(color.class, "size-8 rounded-full border border-black/10")}
                      />
                    </Radio>
                  ))}
                </RadioGroup>
              </fieldset>
  
              <fieldset aria-label="Choose a size" className="mt-4">
                <RadioGroup
                  value={selectedSize}
                  onChange={setSelectedSize}
                  className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4"
                >
                  {product.sizes?.map((size) => (
                    <Radio
                      key={size.name}
                      value={size.name}
                      disabled={!size.inStock}
                      className={`group relative flex items-center justify-center rounded-md px-4 py-3 text-sm font-medium uppercase ${
                        size.inStock
                          ? "bg-white text-gray-900"
                          : "bg-gray-50 text-gray-200 cursor-not-allowed"
                      }`}
                    >
                      {size.name}
                    </Radio>
                  ))}
                </RadioGroup>
              </fieldset>
  
              <button
                onClick={() => handleAddToCart(productWithDefaults)}
                className={`mt-6 mb-8 w-full rounded-md px-4 py-2 text-sm font-medium text-white ${
                  isInCart
                    ? "bg-green-500"
                    : productWithDefaults.isAvailable && productWithDefaults.stock_quantity > 0
                    ? "bg-[#98730C] hover:bg-[#f0bd7a] transition duration-300 ease-in-out"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={isInCart || productWithDefaults.stock_quantity <= 0}
              >
                {isInCart ? (
                  <span>✓ Added to Cart</span>
                ) : productWithDefaults.stock_quantity > 0 ? (
                  <span>Add to Cart</span>
                ) : (
                  <span>Out of Stock</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}


