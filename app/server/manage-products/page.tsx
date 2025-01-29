'use client'
import React, { useState, FormEvent } from 'react';
import useSWR from 'swr';
import ProductList from '@/app/components/Lists/ProductList';
import ProductForm from '@/app/components/Forms/ProductForm';
import PhotoSelectionModal from '../../components/Modals/PhotoSelectonModal';
import { Product, Photo } from '../../interfaces'; 
import GalleryImages from '../../components/Modals/GalleryImages';
import { useConvertedPrice } from '@/app/components/Currency/CurrencyContext';

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
    stock_quantity: 0,
    sizes: 0,
    gallery:[],
    additionalDetails: {  
      weight: 0,
      dimensions: 0,
      manufacturer: '',
      material: '',
      colors: ''
    }
  });

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [isGalleryImagesOpen, setIsGalleryImagesOpen] = useState(false);
  const { getConvertedPrice, selectedCurrency } = useConvertedPrice();

  // Handlers
  const handleAddProduct = async (e: FormEvent) => {
    e.preventDefault();

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
        image_url: '',
        imageAlt: '',
        imageSrc: '',
        isAvailable: false,
        stock_quantity: 0,
        sizes: 0,
        gallery:[],
        additionalDetails: {  
          weight: 0,
          dimensions: 0,
          manufacturer: '',
          material: '',
          colors: ''
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
  
  const handleAddPhotoToProduct = async (mainPhotoUrl: string) => {
    if (!selectedProductId) {
      console.error('No product selected');
      return;
    }
  
    try {
      console.log('Adding main photo:', mainPhotoUrl);
      const response = await fetch(`/api/products`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedProductId, photo: mainPhotoUrl }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to update product photo:', errorData.error);
        throw new Error(errorData.error);
      }
  
      console.log('Main photo updated successfully for product ID:', selectedProductId);
      await mutateProducts();
      setIsPhotoModalOpen(false);
      setSelectedProductId(null);
    } catch (error) {
      console.error('Error adding photo to product:', error);
    }
  };
  
  const handleAddGalleryPhotos = async (imageUrls: string[]) => {
    if (!selectedProductId) {
      console.error('No product selected');
      return;
    }
  
    try {
      console.log('Adding gallery photos:', imageUrls);
      const response = await fetch(`/api/products`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedProductId, gallery: imageUrls }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to update gallery photos:', errorData.error);
        throw new Error(errorData.error);
      }
  
      console.log('Gallery photos updated successfully for product ID:', selectedProductId);
      await mutateProducts();
      setIsGalleryImagesOpen(false);
      setSelectedProductId(null);
    } catch (error) {
      console.error('Error adding photos to gallery:', error);
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

  const openGalleryImages = (productId: number) => {
    setSelectedProductId(productId);
    setIsGalleryImagesOpen(true);
  };

  const closeGalleryImages = () => {
    setIsGalleryImagesOpen(false);
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
        onSelectImage={(photoUrl: string) =>
          setNewProduct({ ...newProduct, image_url: photoUrl })
        }
      />
      <ProductList
        products={products}
        onDelete={handleDeleteProduct}
        onAddPhoto={openPhotoModal}
        onOpenGallery={(productId: number) => openGalleryImages(productId)}
        getConvertedPrice={getConvertedPrice}
        selectedCurrency={selectedCurrency}
      />
      {isPhotoModalOpen && (
        <PhotoSelectionModal
          photos={photos}
          onClose={closePhotoModal}
          onSelect={(mainPhotoUrl) => handleAddPhotoToProduct(mainPhotoUrl)}
          onDeletePhoto={handleDeletePhoto}
        />
      )}
      {isGalleryImagesOpen && (
        <GalleryImages
          photos={photos}
          onClose={closeGalleryImages}
          onSelect={(photoUrls) => handleAddGalleryPhotos(photoUrls)}
          onDeletePhoto={handleDeletePhoto}
        />
      )}
    </div>
  );
};

export default ManageProductsPage;