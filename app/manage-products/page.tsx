'use client'
import React, { useState, FormEvent } from 'react';
import useSWR from 'swr';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';
import PhotoSelectionModal from '../components/PhotoSelectonModal';
import { Product, Photo } from '../interfaces';

// API Fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ManageProductsPage = () => {
  const { data: products = [], mutate: mutateProducts } = useSWR<Product[]>('/api/products', fetcher);
  const { data: photos = [], mutate: mutatePhotos } = useSWR<Photo[]>('/api/photos', fetcher);

  const [newProduct, setNewProduct] = useState<Product>({
    id: 0,
    name: '',
    price: 0,
    image_url: '',
  });

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  // Handlers
  const handleAddProduct = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) throw new Error('Failed to add product');

      await mutateProducts(); // Синхронизируем продукты
      setNewProduct({ id: 0, name: '', price: 0, image_url: '' }); // Очистка формы
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });

      if (!response.ok) throw new Error('Failed to delete product');

      await mutateProducts(); // Синхронизируем продукты
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleAddPhotoToProduct = async (photoUrl: string) => {
    if (!selectedProductId) return;

    try {
      const response = await fetch(`/api/products/${selectedProductId}/photos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: photoUrl }),
      });

      if (!response.ok) throw new Error('Failed to add photo to product');

      await mutateProducts(); 
      await mutatePhotos(); 
      setIsPhotoModalOpen(false); 
    } catch (error) {
      console.error('Error adding photo to product:', error);
    }
  };

  const openPhotoModal = (productId: number) => {
    setSelectedProductId(productId);
    setIsPhotoModalOpen(true);
  };

  const closePhotoModal = () => {
    setIsPhotoModalOpen(false);
    setSelectedProductId(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <h1 className="text-center text-gray-800 text-3xl font-bold mb-8">Manage Products</h1>
        <ProductForm
          newProduct={newProduct}
          setNewProduct={setNewProduct}
          photos={photos}
          onSubmit={handleAddProduct}
          onSelectImage={(photoUrl) =>
            setNewProduct({ ...newProduct, image_url: photoUrl })
          }
        />
        <ProductList
          products={products}
          onDelete={handleDeleteProduct}
          onAddPhoto={openPhotoModal}
        />
        {isPhotoModalOpen && (
          <PhotoSelectionModal
            photos={photos}
            onClose={closePhotoModal}
            onSelect={handleAddPhotoToProduct}
          />
        )}
    </div>
  );
};

export default ManageProductsPage;
