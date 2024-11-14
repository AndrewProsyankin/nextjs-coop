// pages/products.tsx
import { sql } from '@vercel/postgres';
import Link from 'next/link';
import Header from '../components/Header';
import CustomImage from '../components/CustomImage';

interface Product {
  id: number;
  name: string;
  price: number;
  photo: string|null;
  image_url: string;
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
              <div>
                <h2>{product.name}</h2>
                <p>${product.price}</p>
                {product.photo && <CustomImage image_url={product.photo} alt={product.name} width={200} height={200} />}
                <Link href={`/products/edit/${product.id}`}>View</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductsPage;
