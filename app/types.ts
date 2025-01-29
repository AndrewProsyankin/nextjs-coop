import { Dispatch, SetStateAction } from "react";

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

export interface AdditionalDetails {
  weight: number; 
  dimensions: number; 
  manufacturer: string; 
  material: string;
  colors: string; 
}
  
  export interface CartItem {
    id: number;
    quantity: number;
    color: string;
  }

  export interface CartContextType {
    cartItems: CartItem[]}

    export interface CartUpdaterProps {
        products: Product[];
        cartItems: CartItem[];
        setCartItems: Dispatch<SetStateAction<CartItem[]>>;
      }