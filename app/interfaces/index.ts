export interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  imageAlt: string;
  imageSrc: string;
  isAvailable: boolean; 
  stock_quantity: number; 
  }
  
  export interface Photo {
    key: string;
    url: string;
  }
  