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
    imageAlt: '',
    imageSrc: '',
    isAvailable: false,
    stock_quantity: 0
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

      await mutateProducts();
      setNewProduct({
        id: 0,
        name: '',
        price: 0,
        image_url: '',
        imageAlt: '',
        imageSrc: '',
        isAvailable: false,
        stock_quantity: 0
      });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
  
      if (!response.ok) throw new Error('Failed to delete product');
  
      await mutateProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  
  const handleDeletePhoto = async (photoKey: string) => {
    try {
      const response = await fetch(`/api/photos/${photoKey}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete photo');
      await mutatePhotos();
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };
  

  const handleAddPhotoToProduct = async (photoUrl: string) => {
    if (!selectedProductId) return;

    try {
      await fetch(`/api/products/${selectedProductId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photo: photoUrl }),
      });

      await mutateProducts();
      await mutatePhotos();
      setIsPhotoModalOpen(false);
      setSelectedProductId(null);
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
          onSelect={(photoUrl) => handleAddPhotoToProduct(photoUrl)}
          onDeletePhoto={handleDeletePhoto}
        />
      )}
    </div>
  );
};

export default ManageProductsPage;
