'use client';
import productsData from '@/app/data/products.json';
import { useCart } from '@/app/components/CartContext';
import Header from '@/app/components/Header';


interface Product{
  id: number;
  name: string;
  price: number;
  imageSrc: string;
  imageAlt: string;
  quantity: number;
  color: string; 
}
const typedProductsData: Product[] = productsData as Product[];

export default function ProductPage() {
  const { addToCart } = useCart();

  return (
    <div>
      <Header /> {}
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Products</h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {typedProductsData.map((product: Product) => ( 
              <div key={product.id} className="group">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                  <img
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
                </div>
                <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">${product.price.toFixed(2)}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-4 w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Add to cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
