export interface Product {
  id: number;
  name: string;
  price: number;
  colors: [];
  image_url: string;
  imageAlt: string;
  imageSrc: string;
  isAvailable: boolean; 
  stock_quantity: number; 
  sizes: number;
  additionalDetails: AdditionalDetails;
  }
  
  export interface Photo {
    key: string;
    url: string;
  }

  export interface AdditionalDetails {
    weight: string; 
    dimensions: string; 
    manufacturer: string; 
    material: string;
    careInstructions: string; 
    colors: string[]; 
  }

  export interface ProductsListProps {
    products: Product[];
  }
  