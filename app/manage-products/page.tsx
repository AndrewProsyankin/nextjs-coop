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
    colors: [],
    image_url: '',
    imageAlt: '',
    imageSrc: '',
    isAvailable: false,
    stock_quantity: 0,
    sizes: 0,
    additionalDetails: {  
      weight: '',
      dimensions: '',
      manufacturer: '',
      material: '',
      careInstructions: '',
      colors: []
    }
  });

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  // Handlers
  const handleAddProduct = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate product data
    if (!newProduct.name || newProduct.price <= 0) {
      alert('Product name and price are required!');
      return;
    }
  
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(errorDetails.message || 'Failed to add product');
      }
  
      await mutateProducts();
      await mutatePhotos();
      setNewProduct({
        id: 0,
        name: '',
        price: 0,
        colors: [],
        image_url: '',
        imageAlt: '',
        imageSrc: '',
        isAvailable: false,
        stock_quantity: 0,
        sizes: 0,
        additionalDetails: {  
          weight: '',
          dimensions: '',
          manufacturer: '',
          material: '',
          careInstructions: '',
          colors: []
        }
      });
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    }
  };
  

  const handleDeleteProduct = async (id: number) => {
    try {
      const response = await fetch(`/api/products?id=${id}`, { 
        method: 'DELETE',
      });
  
      if (!response.ok) throw new Error('Failed to delete product');
  
      await mutateProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  
  
  const handleDeletePhoto = async (photoUrl: string) => {
    try {
      const response = await fetch(`/api/photos`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoUrl }), 
      });
  
      if (!response.ok) throw new Error('Failed to delete photo');
  
      await mutatePhotos();
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };
  


  const handleAddPhotoToProduct = async (photoUrl: string) => {
    if (!selectedProductId) {
      console.error('No product selected');
      return;
    }
  
    try {
      const response = await fetch(`/api/products`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedProductId, photo: photoUrl }), 
      });
  
      if (!response.ok) throw new Error('Failed to update product photo');
  
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
