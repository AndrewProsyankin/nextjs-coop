'use client';

import { useState, FormEvent } from 'react';
import useSWR from 'swr';
import CustomImage from '../components/CustomImage';

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  photo: string | null;
  [key: string]: string | number | null;
}

interface Photo {
  key: string;
  url: string;
}

interface ProductFormProps {
  newProduct: Product;
  setNewProduct: React.Dispatch<React.SetStateAction<Product>>;
  photos: Photo[] | undefined;
  onSubmit: (e: React.FormEvent) => void;
  onSelectImage: (photoUrl: string) => void;
}

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  });

const ManageProductsPage = () => {
  const { data: products, error: productError, mutate: mutateProducts } = useSWR<Product[]>('/api/products', fetcher);
  const { data: photos, error: photoError } = useSWR<Photo[]>('/api/photos', fetcher);

  const [newProduct, setNewProduct] = useState<Product>({
    id: 0,
    name: '',
    price: 0,
    photo: null,
    image_url: '',
  });

  const handleAddProduct = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const productWithImage = { ...newProduct, image_url: newProduct.image_url || '/path/to/default-image.jpg' };
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productWithImage),
      });
      setNewProduct({ id: 0, name: '', price: 0, photo: null, image_url: '' });
      mutateProducts();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      mutateProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleSelectImage = (photoUrl: string) => {
    setNewProduct((prev) => ({ ...prev, image_url: photoUrl, photo: photoUrl }));
  };

  if (productError) return <ErrorNotification message="Error loading products data." />;
  if (photoError) return <ErrorNotification message="Error loading photo data." />;

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <h1 className="text-center text-gray-800 text-2xl font-bold mb-8">Manage Products</h1>

      {/* Product List */}
      <ProductList products={products} onDelete={handleDeleteProduct} />

      {/* Add New Product Form */}
      <ProductForm
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        photos={photos}
        onSubmit={handleAddProduct}
        onSelectImage={handleSelectImage}
      />

      {/* Uploaded Photos */}
      <UploadedPhotos photos={photos} />
    </div>
  );
};

const ProductList = ({ products, onDelete }: { products: Product[] | undefined; onDelete: (id: number) => void }) => (
  <div className="max-w-4xl mx-auto p-8 bg-gray-200 rounded-lg mb-12 space-y-4">
    <h2 className="text-center text-gray-700 font-semibold mb-6">Product List</h2>
    {products && products.length > 0 ? (
      <ul className="space-y-4">
        {products.map((product) => (
          <li key={product.id} className="flex items-center justify-between p-4 bg-white rounded-md shadow-md">
            <div className="flex items-center space-x-4">
              <CustomImage
                image_url={product.image_url} // No need for fallback in here, handle it inside CustomImage
                alt={product.name}
                width={200}
                height={200}
                className="rounded-md border border-gray-300"
              />
              <div className="text-gray-700">
                <p className="font-semibold">ID: {product.id}</p>
                <p>{product.name} - ${product.price}</p>
              </div>
            </div>
            <button
              onClick={() => onDelete(product.id)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
            >
              Delete Product
            </button>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-600">No Products</p>
    )}
  </div>
);

const ProductForm: React.FC<ProductFormProps> = ({ newProduct, setNewProduct, photos, onSubmit, onSelectImage }) => (
  <div className="max-w-4xl mx-auto p-8 bg-gray-200 rounded-lg mb-12">
    <h2 className="text-center text-gray-700 font-semibold mb-6">Add New Product</h2>
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {['name', 'price'].map((field, index) => (
          <div key={index} className="flex flex-col text-gray-700">
            <label className="font-medium text-gray-700 mb-2">
              Product {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type="text"
              value={newProduct[field as keyof Product] ?? ''}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  [field]: field === 'price' ? Number(e.target.value) : e.target.value,
                })
              }
              required
              className="p-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col mb-6 text-gray-700">
        <label className="font-medium text-gray-700 mb-2">Select Product Photo</label>
        <select
          value={newProduct.photo ?? ''}
          onChange={(e) => onSelectImage(e.target.value)}
          required
          className="p-3 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a photo</option>
          {photos?.map((photo) => (
            <option key={photo.key} value={photo.url}>
              {photo.key}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="w-full p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
        Add Product
      </button>
    </form>
  </div>
);

const UploadedPhotos = ({ photos }: { photos: Photo[] | undefined }) => (
  <div className="max-w-4xl mx-auto p-8 bg-gray-200 rounded-lg mb-6">
    <h2 className="text-center text-gray-700 font-semibold mb-12">Uploaded Photos</h2>
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {photos?.map((photo) => (
        <li key={photo.key} className="flex flex-col items-center p-4 bg-white rounded-md shadow-md">
          <CustomImage image_url={photo.url} alt="photo" width={64} height={64} className="object-cover rounded-md border border-gray-300" />
          <a href={photo.url} className="text-blue-600 hover:underline mt-2">
            {photo.key}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const ErrorNotification = ({ message }: { message: string }) => (
  <div className="bg-red-500 text-white p-4 rounded-md text-center">{message}</div>
);

export default ManageProductsPage;
