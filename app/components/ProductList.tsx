import React from 'react';
import { Product } from '../interfaces';
import CustomImage from './CustomImage';

interface ProductListProps {
products: Product[];
onDelete: (id: number) => void;
onAddPhoto: (id: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onDelete, onAddPhoto }) => (
  <div className="max-w-4xl mx-auto p-8 bg-gray-200 rounded-lg mb-12 space-y-4">
    <h2 className="text-center text-gray-700 font-semibold mb-6">Product List</h2>
    {products.length > 0 ? (
      <ul className="space-y-4">
        {products.map((product) => (
          <li
            key={product.id}
            className="flex items-center justify-between p-4 bg-white rounded-md shadow-md"
          >
            <div className="flex items-center space-x-4">
              <CustomImage
                image_url={product.image_url}
                alt={product.name}
                width={100}
                height={100}
                className="rounded-md"
              />
              <div>
                <p className="text-gray-700">{product.name}</p>
                <p className="text-gray-700">${product.price}</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => onAddPhoto(product.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Add Photo
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p>No Products</p>
    )}
  </div>
);

export default ProductList;