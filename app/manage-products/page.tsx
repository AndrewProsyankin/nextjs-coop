'use client';

import { useState, FormEvent } from 'react';
import useSWR from 'swr';
import CustomImage from '../components/CustomImage';

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

interface Photo {
  key: string;
  url: string;
}

interface ProductForm {
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
    image_url: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const handleAddProduct = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const productWithImage = {
        ...newProduct,
        image_url: newProduct.image_url || '/path/to/default-image.jpg',
      };

      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productWithImage),
      });

      setNewProduct({ id: 0, name: '', price: 0, image_url: '' });
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

  const handleOpenPhotoModal = (productId: number) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

 //выбор фото для модалки
  const handleSelectPhotoForProduct = async (photoUrl: string) => {
    if (selectedProductId === null) return;
  
    try {
      await fetch(`/api/products?id=${selectedProductId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: photoUrl }),
      });
  
      mutateProducts();
      setIsModalOpen(false); 
      setSelectedProductId(null); 
    } catch (error) {
      console.error('Error updating product photo:', error);
    }
  };
  

  // выбор фото для формы
  const handleSelectImage = (photoUrl: string) => {
    setNewProduct((prev) => ({ ...prev, image_url: photoUrl }));
  };

  if (productError) return 'Error loading products data.';
  if (photoError) return 'Error loading photo data.';

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <h1 className="text-center text-gray-800 text-2xl font-bold mb-8">Manage Products</h1>

      {/* Список товаров */}
      <ProductList
        products={products}
        onDelete={handleDeleteProduct}
        onAddPhoto={handleOpenPhotoModal}
      />

      {/* Форма добавления товара */}
      <ProductForm
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        photos={photos || []} 
        onSubmit={handleAddProduct}
        onSelectImage={handleSelectImage}
      />


      {/* Модальное окно выбора фото */}
      {isModalOpen && (
        <PhotoSelectionModal
          photos={photos}
          onClose={() => setIsModalOpen(false)}
          onSelect={handleSelectPhotoForProduct}
        />
      )}
    </div>
  );
};

const ProductList = ({ products, onDelete, onAddPhoto }: any) => (
  <div className="max-w-4xl mx-auto p-8 bg-gray-200 rounded-lg mb-12 space-y-4">
    <h2 className="text-center text-gray-700 font-semibold mb-6">Product List</h2>
    {products && products.length > 0 ? (
      <ul className="space-y-4">
        {products.map((product: Product) => (
          <li
            key={product.id}
            className="flex items-center justify-between p-4 bg-white rounded-md shadow-md"
          >
            <div className="flex items-center space-x-4">
              <CustomImage
                image_url={product.image_url || null}
                alt={product.name}
                width={100}
                height={100}
                className="rounded-md"
              />
              <div>
                <p className="text-gray-700">{product.name}</p>
                <p className=" text-gray-700">${product.price}</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => onAddPhoto(product.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Add Photo
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p>No Products</p>
    )}
  </div>
);


const PhotoSelectionModal = ({
  photos,
  onClose,
  onSelect,
}: {
  photos: Photo[] | undefined;
  onClose: () => void;
  onSelect: (photoUrl: string) => void;
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-lg p-8 max-w-lg w-full space-y-6">
      <h2 className="text-lg font-semibold text-gray-700">Select a Photo</h2>
      <ul className="grid grid-cols-2 gap-4">
        {photos?.map((photo) => (
          <li
            key={photo.key}
            className="cursor-pointer"
            onClick={() => onSelect(photo.url)}
          >
            <CustomImage
              image_url={photo.url}
              alt={photo.key}
              width={100}
              height={100}
              className="object-cover rounded-md border border-gray-300"
            />
          </li>
        ))}
      </ul>
      <button onClick={onClose} className="w-full bg-red-600 text-white py-2 rounded-md">
        Close
      </button>
    </div>
  </div>
);


const ProductForm: React.FC<{
  newProduct: Product;
  setNewProduct: (product: Product) => void;
  photos: Photo[];
  onSubmit: (e: React.FormEvent) => void;
  onSelectImage: (imageUrl: string) => void;
}> = ({ newProduct, setNewProduct, photos, onSubmit, onSelectImage }) => (
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
          onChange={(e) => onSelectImage(e.target.value)}
          value={newProduct.image_url ?? ''}
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


export default ManageProductsPage;
