import React, { FormEvent } from 'react';
import { Photo, Product } from '../interfaces';

interface ProductFormProps {
  newProduct: Product;
  setNewProduct: React.Dispatch<React.SetStateAction<Product>>;
  photos: Photo[];
  onSubmit: (e: FormEvent) => void;
  onSelectImage: (photoUrl: string) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  newProduct,
  setNewProduct,
  photos,
  onSubmit,
  onSelectImage,
}) => {
  const productFields: Array<"name" | "price" | "stock_quantity"> = ["name", "price", "stock_quantity"];
  const additionalFields: Array<keyof Product["additionalDetails"]> = [
    "weight",
    "dimensions",
    "manufacturer",
    "material",
    "colors",
  ];

  const handleAdditionalChange = (
    field: keyof Product["additionalDetails"],
    value: string | string[]
  ) => {
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
        {/* Product */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {productFields.map((field) => (
            <div key={field} className="flex flex-col text-gray-700">
              <label className="font-medium text-gray-700 mb-2">
                Product {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === "price" ? "number" : "text"}
                value={newProduct[field] ?? ''}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    [field]: field === "price" ? Number(e.target.value) : e.target.value,
                  })
                }
                required
                className="p-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
        {/* AdditionalDetails */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {additionalFields.map((field) => (
            <div key={field} className="flex flex-col text-gray-700">
              <label className="font-medium text-gray-700 mb-2">
                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
              {field === "colors" ? (
                <input
                  type="text"
                  value={newProduct.additionalDetails.colors.join(", ")}
                  onChange={(e) =>
                    handleAdditionalChange(
                      "colors",
                      e.target.value.split(",").map((color) => color.trim())
                    )
                  }
                  required
                  placeholder="Enter colors separated by commas"
                  className="p-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <input
                  type="text"
                  value={newProduct.additionalDetails[field] ?? ''}
                  onChange={(e) => handleAdditionalChange(field, e.target.value)}
                  required
                  className="p-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          ))}
        </div>
        {/* Image */}
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
