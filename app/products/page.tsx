'use client';

import useSWR, { mutate } from 'swr';
import { useState } from 'react';
import Link from 'next/link';
import CustomImage from '../components/CustomImage';

interface Product {
  id: number;
  name: string;
  price: number;
  photo?: string;
}

// Функция для получения данных
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
        mutate('/api/products'); // Обновить список продуктов
      } else {
        alert('Ошибка при удалении продукта');
      }
    } catch (error) {
      console.error('Ошибка удаления:', error);
    }
  };

  const handleAddProduct = async () => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        mutate('/api/products'); // Обновить список продуктов
        setNewProduct({ name: '', price: 0, photo: '' }); // Сброс формы
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
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Продукты</h1>

      {/* Форма добавления продукта */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Добавить продукт</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Название"
            value={newProduct.name}
            onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
            className="border rounded p-2"
          />
          <input
            type="number"
            placeholder="Цена"
            value={newProduct.price}
            onChange={(e) => setNewProduct((prev) => ({ ...prev, price: Number(e.target.value) }))}
            className="border rounded p-2"
          />
          <input
            type="text"
            placeholder="URL изображения"
            value={newProduct.photo}
            onChange={(e) => setNewProduct((prev) => ({ ...prev, photo: e.target.value }))}
            className="border rounded p-2"
          />
        </div>
        <button
          onClick={handleAddProduct}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Добавить
        </button>
      </div>

      {/* Список продуктов */}
      {products.length === 0 ? (
        <p>Продуктов пока нет</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <li key={product.id} className="p-4 bg-gray-100 rounded shadow">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-600">${product.price}</p>
              {product.photo && (
                <CustomImage image_url={product.photo} alt={product.name} width={200} height={200} />
              )}
              <div className="flex justify-between mt-4">
                <Link href={`/products/edit/${product.id}`} className="text-blue-500 hover:underline">
                  Редактировать
                </Link>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-red-500 hover:underline"
                >
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
