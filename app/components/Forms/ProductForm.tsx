import React, { FormEvent } from 'react';
import { Photo, Product } from '@/app/interfaces'; 
interface ProductFormProps {
  newProduct: Product;
  setNewProduct: (product: Product) => void;
  photos: Photo[];
  onSubmit: (e: FormEvent) => void;
  onSelectImage: (photoUrl: string) => void; 
}

const ProductForm: React.FC<ProductFormProps> = ({
  newProduct,
  setNewProduct,
  onSubmit,

}) => {
  const productFields = ['name', 'price', 'stock_quantity'] as const;
  const additionalFields: Array<keyof Product['additionalDetails']> = [
    'weight',
    'dimensions',
    'manufacturer',
    'material',
    'colors',
  ];

  const handleAdditionalChange = (field: keyof Product['additionalDetails'], value: string | string[]) => {
    setNewProduct({
      ...newProduct,
      additionalDetails: {
        ...newProduct.additionalDetails,
        [field]: value,
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-200 rounded-lg mb-12">
      <h2 className="text-center text-gray-700 font-semibold mb-6">Add New Product</h2>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Product Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {productFields.map((field) => (
            <div key={field} className="flex flex-col text-gray-700">
              <label className="font-medium text-gray-700 mb-2">
                {`Product ${field.charAt(0).toUpperCase() + field.slice(1)}`}
              </label>
              <input
                type={field === 'price' ? 'number' : 'text'}
                value={newProduct[field] ?? ''}
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

        {/* Additional Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {additionalFields.map((field) => (
            <div key={field} className="flex flex-col text-gray-700">
              <label className="font-medium text-gray-700 mb-2">
                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                type="text"
                value={Array.isArray(newProduct.additionalDetails[field])
                  ? (newProduct.additionalDetails[field] as string[]).join(', ')
                  : (newProduct.additionalDetails[field] as string)}
                onChange={(e) =>
                  handleAdditionalChange(
                    field,
                    field === 'colors' ? e.target.value.split(',').map((c) => c.trim()) : e.target.value
                  )
                }
                required
                className="p-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
