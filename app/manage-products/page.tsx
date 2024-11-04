// ManageProductsPage.tsx
'use client';

import { useState, FormEvent } from 'react';
import useSWR from 'swr';

interface Product {
  id: number;
  name: string;
  price: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ManageProductsPage = () => {
  const { data: products, error, mutate } = useSWR<Product[]>('/api/products', fetcher);
  const [newProduct, setNewProduct] = useState({ name: '', price: 0 });

  const handleAddProduct = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      setNewProduct({ name: '', price: 0 });
      mutate(); // Обновляем данные после добавления
    } catch (error) {
      console.error('Ошибка при добавлении продукта:', error);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      await fetch(`/api/products?id=${productId}`, {
        method: 'DELETE',
      });
      mutate(); // Обновляем данные после удаления
    } catch (error) {
      console.error('Ошибка при удалении продукта:', error);
    }
  };

  if (error) {
    return <div>Ошибка при загрузке данных.</div>;
  }

  return (
    <div>
      <h1>Manage Products</h1>
      <ul>
        {products?.map((product) => (
          <li key={product.id}>
            {product.name} - ${product.price}
            <button onClick={() => handleDeleteProduct(product.id)}>Удалить</button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddProduct}>
        <h2>Добавить новый продукт</h2>
        <input
          type="text"
          placeholder="Название продукта"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Цена продукта"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
        />
        <button type="submit">Добавить продукт</button>
      </form>
    </div>
  );
};

export default ManageProductsPage;
