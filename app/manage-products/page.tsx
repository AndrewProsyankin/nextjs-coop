'use client'
import Image from 'next/image';
import { useState, FormEvent } from 'react';
import useSWR from 'swr';

interface Product {
  id: number;
  name: string;
  price: number;
  photo: string | null;
}

interface Photo {
  key: string;
  url: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ManageProductsPage = () => {
  const { data: products, error: productError, mutate: mutateProducts } = useSWR<Product[]>('/api/products', fetcher);
  const { data: photos, error: photoError } = useSWR<Photo[]>('/api/photos', fetcher);  // Client-side fetching for photos
  const [newProduct, setNewProduct] = useState({ id: 0, name: '', price: 0, photo: '' });

  const handleAddProduct = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const newProductData = { ...newProduct };

      // Create product on server
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProductData),
      });

      setNewProduct({ id: 0, name: '', price: 0, photo: '' });
      mutateProducts();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      mutateProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleSelectImage = (photoUrl: string) => {
    setNewProduct((prev) => ({ ...prev, photo: photoUrl }));
  };

  if (productError) return <div>Error loading products data.</div>;
  if (photoError) return <div>Error loading photo data.</div>;

  return (
    <div>
      <h1>Manage Products</h1>
      <ul>
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <li key={product.id} className="flex items-center space-x-4 mb-2">
              <Image
                src={product.photo ?? '/path/to/default-image.jpg'}
                alt={product.name}
                width={64}
                height={64}
                className="object-cover"
              />
              <div>ID: {product.id}, {product.name} - ${product.price}</div>
              <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600">Delete Product</button>
            </li>
          ))
        ) : (
          <p>No Products</p>
        )}
      </ul>

      <form onSubmit={handleAddProduct} className="max-w-4xl mx-auto p-8 bg-gray-100 rounded-lg">
        <h2 className="text-gray-700 font-semibold mb-6">Add New Product</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col text-gray-700">
            <label className="font-medium text-gray-700 mb-2">Product ID</label>
            <input
              type="text-gray-700"
              value={newProduct.id}
              onChange={(e) => setNewProduct({ ...newProduct, id: Number(e.target.value) })}
              required
              className="p-3 text-lg border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-2">Product Name</label>
            <input
              type="text-gray-700"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              required
              className="p-3 text-lg border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col text-gray-700">
            <label className="font-medium text-gray-700 mb-2">Product Price</label>
            <input
              type="text-gray-700"
              placeholder="Product Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
              required
              className="p-3 text-lg border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Dropdown to select a photo */}
        <div className="flex flex-col mb-6 text-gray-700">
          <label className="font-medium text-gray-700 mb-2">Product Image</label>
          <select
            value={newProduct.photo ?? ''}
            onChange={(e) => handleSelectImage(e.target.value)}
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

      <h2 className="mt-8 text-2xl-gray-700 font-semibold">Uploaded Photos</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {photos?.map((photo) => (
          <li key={photo.key} className="flex flex-col items-center">
            <Image src={photo.url} alt="photo" width={64} height={64} className="object-cover" />
            <a href={photo.url} className="text-blue-600 hover:underline mt-2">
              {photo.key}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageProductsPage;
