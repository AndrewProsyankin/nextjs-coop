'use client';

import useSWR, { mutate } from 'swr';
import { useState } from 'react';
import CustomImage from '../components/CustomImage';

interface Product {
  id: number;
  name: string;
  price: number;
  photo?: string;
}

const fetchProducts = async () => {
  const response = await fetch('/api/products');
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export default function ProductsPage() {
  const { data: products, error } = useSWR<Product[]>('/api/products', fetchProducts);
  const [newProduct, setNewProduct] = useState({ name: '', price: 0, photo: '' });

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить продукт?')) return;

    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        mutate('/api/products');
      } else {
        alert('Ошибка при удалении продукта');
      }
    } catch (error) {
      console.error('Ошибка удаления:', error);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        mutate('/api/products');
        setNewProduct({ name: '', price: 0, photo: '' });
      } else {
        alert('Ошибка добавления продукта');
      }
    } catch (error) {
      console.error('Ошибка добавления продукта:', error);
    }
  };

  if (error) return <div>Ошибка загрузки продуктов</div>;
  if (!products) return <div>Загрузка...</div>;

  return (
    <div className="bg-gray-100 min-h-screen py-8">

      {/* Product List */}
      <div className="max-w-4xl mx-auto p-8 bg-gray-200 rounded-lg mb-12 space-y-4">
        <h2 className="text-center text-gray-700 font-semibold mb-6">Products</h2>
        {products.length > 0 ? (
          <ul className="space-y-4">
            {products.map((product) => (
              <li key={product.id} className="flex items-center justify-between p-4 bg-white rounded-md shadow-md">
                <div className="flex items-center space-x-4">
                  {product.photo && (
                    <CustomImage
                      image_url={product.photo}
                      alt={product.name}
                      width={100}
                      height={100}
                      className="rounded-md border border-gray-300"
                    />
                  )}
                  <div className="text-gray-700">
                    <p className="font-semibold">{product.name}</p>
                    <p>${product.price}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No Products</p>
        )}
      </div>

      {/* Add New Product Form */}
      <div className="max-w-4xl mx-auto p-8 bg-gray-200 rounded-lg">
        <h2 className="text-center text-gray-700 font-semibold mb-6">Add New Product</h2>
        <form onSubmit={handleAddProduct} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col text-gray-700">
              <label className="font-medium mb-2">Product Name</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
                required
                className="p-3 text-lg border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col text-gray-700">
              <label className="font-medium mb-2">Price</label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct((prev) => ({ ...prev, price: Number(e.target.value) }))}
                required
                className="p-3 text-lg border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}
