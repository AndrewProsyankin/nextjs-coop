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
const getProducts = async () => {
  try {
    const result = (await sql<Product>`SELECT * FROM products;`).rows;
 
    return { products: result };
  } catch (error) {
    console.error('Error fetching products:', error);

    // Fallback to returning empty array or previous data
    return { products: [] };
  }
};



// Компонент для отображения товаров
const ProductsPage = async ({}: { searchParams: ProductsSearchParams }) => {
  const { products } = await getProducts();

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
              {product.name} - ${product.price} - <Link href={`/products/edit/${product.id}`}>View</Link>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductsPage;
