import ProductsList from '@/app/components/ProductsLists';

const fetchProducts = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`); 
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка при получении данных с API:', error);
    return [];
  }
};

export default async function ProductsPage() {
  const products = await fetchProducts();
  return (
    <main>
      <ProductsList products={products} />
    </main>
  );
}
