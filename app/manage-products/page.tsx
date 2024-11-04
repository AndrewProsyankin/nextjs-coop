'use client';
import { useState, FormEvent } from 'react';

interface Product {
  id: number;
  name: string;
  price: string;
}

const ManageProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: 0 });
  const [isLoading, setIsLoading] = useState(false);

  // Функция для загрузки продуктов из БД
  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const productsData = await response.json();
        setProducts(productsData);
      } else {
        alert('Ошибка при загрузке продуктов');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для добавления нового продукта
  const handleAddProduct = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      if (response.ok) {
        alert('Продукт успешно добавлен');
        setNewProduct({ name: '', price: 0 });
        loadProducts(); // Обновляем список после добавления
      } else {
        alert('Ошибка при добавлении продукта');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  // Функция для удаления продукта по ID
  const handleDeleteProduct = async (productId: number) => {
    try {
      console.log(`Удаление продукта с ID: ${productId}`);
      const response = await fetch(`/api/products?id=${productId}`, {
        method: 'DELETE',
      });
      console.log('Ответ сервера:', response);
      if (response.ok) {
        alert('Продукт успешно удален');
        loadProducts(); // Обновляем список продуктов после удаления
      } else {
        alert('Ошибка при удалении продукта');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  return (
    <div>
      <h1>Manage Products</h1>
      <button onClick={loadProducts} disabled={isLoading}>
        {isLoading ? 'Загрузка...' : 'Загрузить продукты'}
      </button>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - ${product.price}
            <button onClick={() => handleDeleteProduct(product.id)}>Удалить</button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddProduct}>
        <h2>Добавить новый продукт</h2>
        <input 
          className="text-lg font-medium text-gray-900"
          type="text"
          placeholder="Название продукта"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          className="text-lg font-medium text-gray-900"
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
