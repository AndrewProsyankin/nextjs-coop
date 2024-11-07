'use client';
import { useState, FormEvent } from 'react';
import useSWR from 'swr';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  price: number;
  photo: string | null;
}

interface Photo {
  id: number;
  url: string;
  product_id: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ManageProductsPage = () => {
  const { data: products, error: productError, mutate: mutateProducts } = useSWR<Product[]>('/api/products', fetcher);
  const { data: photos, mutate: mutatePhotos } = useSWR<Photo[]>('/api/photos', fetcher);

  const [newProduct, setNewProduct] = useState({ name: '', price: 0, productId: 0, photo: '' });
  const [newPhoto, setNewPhoto] = useState({ url: '', productId: 0 });

  const handleAddProduct = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      setNewProduct({ name: '', price: 0, productId: 0, photo: '' });
      mutateProducts(); // Refresh product list
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleAddPhoto = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newPhoto.url, product_id: newPhoto.productId }),
      });
      setNewPhoto({ url: '', productId: 0 });
      mutatePhotos(); // Refresh photo list
    } catch (error) {
      console.error('Error adding photo:', error);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      await fetch(`/api/products?id=${productId}`, { method: 'DELETE' });
      mutateProducts(); // Refresh product list
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleDeletePhoto = async (productId: number) => {
    try {
      await fetch(`/api/products/photo?id=${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photo: null }), // Set photo to null
      });
      mutateProducts(); // Refresh product list after deleting photo
    } catch (error) {
      console.error('Error deleting product photo:', error);
    }
  };

  if (productError) {
    return <div>Error loading data.</div>;
  }

  return (
    <div>
      <h1>Manage Products</h1>
      <ul>
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <li key={product.id} className="flex items-center space-x-4 mb-2">
              {product.photo ? (
                <Image
                  src={product.photo}
                  alt={product.name}
                  width={64}
                  height={64}
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-16 h-16 bg-gray-300 flex items-center justify-center">
                  <span>No Image</span>
                </div>
              )}
              <div>ID: {product.id}, {product.name} - ${product.price}</div>
              <button onClick={() => handleDeleteProduct(product.id)}>Delete Product</button>
              {product.photo && (
                <button onClick={() => handleDeletePhoto(product.id)}>Delete Photo</button>
              )}
            </li>
          ))
        ) : (
          <div className="w-16 h-16 bg-gray-300 flex items-center justify-center">
            <span>No Products</span>
          </div>
        )}
      </ul>

      <h2>Photos</h2>
      <ul className="space-y-4">
        {photos?.map((photo) => (
          <li key={photo.id} className="flex items-center space-x-4">
            <Image
              src={photo.url}
              alt={`Product photo ${photo.product_id}`}
              width={64}
              height={64}
              className="object-cover w-12 h-12 border rounded"
            />
            <div>
              <a href={photo.url} className="text-blue-600 hover:underline">
                {photo.url}
              </a>
              <div>Product ID: {photo.product_id}</div>
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAddProduct}>
        <h2>Add New Product</h2>
        <input
          className="text-gray-900"
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          className="text-gray-900"
          type="number"
          placeholder="Product Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
        />
        <input
          className="text-gray-900"
          type="number"
          placeholder="Product ID"
          value={newProduct.productId}
          onChange={(e) => setNewProduct({ ...newProduct, productId: Number(e.target.value) })}
        />
        <input
          className="text-gray-900"
          type="url"
          placeholder="Product Photo URL"
          value={newProduct.photo}
          onChange={(e) => setNewProduct({ ...newProduct, photo: e.target.value })}
        />
        <button type="submit">Add Product</button>
      </form>

      <form onSubmit={handleAddPhoto} className="mt-6">
        <h2>Add New Photo</h2>
        <input
          className="text-gray-900"
          type="url"
          placeholder="Photo URL"
          value={newPhoto.url}
          onChange={(e) => setNewPhoto({ ...newPhoto, url: e.target.value })}
        />
        <input
          className="text-gray-900"
          type="number"
          placeholder="Product ID"
          value={newPhoto.productId}
          onChange={(e) => setNewPhoto({ ...newPhoto, productId: Number(e.target.value) })}
        />
        <button type="submit">Add Photo</button>
      </form>
    </div>
  );
};

export default ManageProductsPage;
