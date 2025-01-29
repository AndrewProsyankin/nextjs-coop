export interface Product {
  id: number;
  name: string;
  price: number; 
  image_url: string;
  imageAlt: string;
  imageSrc: string;
  isAvailable: boolean;
  stock_quantity: number;
  sizes: number;
  additionalDetails: AdditionalDetails;
  gallery: string[];
}
  export interface Photo {
    key: string;
    url: string;
    urls: string[];
  }

  export interface AdditionalDetails {
    weight: number; 
    dimensions: number; 
    manufacturer: string; 
    material: string;
    colors: string; 
  }

  export interface ProductsListProps {
    products: Product[];
  }
  