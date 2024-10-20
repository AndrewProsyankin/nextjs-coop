// pages/products.tsx
import { sql } from '@vercel/postgres';
import Link from 'next/link';
import Header from '../components/Header';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface ProductsSearchParams {
  id?: number;
}

// SSR: Получение данных на стороне сервера
export const getProducts = async ({
  id
}: ProductsSearchParams) => {
  try {
    if (id) {
      const { rows } = await sql<Product>`SELECT * FROM products WHERE id = ${id};`;
      return {
        products: rows,
      };
    } else {
      const { rows } = await sql<Product>`SELECT * FROM products;`;
      return {
        products: rows,
      };
    }

  } catch (error) {
    console.error('Error fetching products:', error);

    // Возвращаем пустой массив в случае ошибки
    return {
      products: [],
    };
  }
};

// Компонент для отображения товаров
const ProductsPage = async ({ searchParams: initialSearchParams }: { searchParams: ProductsSearchParams }) => {
  const { products } = await getProducts(initialSearchParams);
  return (
    <div>
      <Header />
      <h1>Products</h1>
      {products.length === 0 ? (
        <p>No products available</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name} - ${product.price} - <Link href={`/products?id=${product.id}`}>View</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductsPage;
