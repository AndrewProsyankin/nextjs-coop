import { Dispatch, SetStateAction } from "react";

// types.ts
export interface Product {
    id: number;
    name: string;
    price: number;
    colors: [];
    image_url: string;
    isAvailable: boolean;
    imageAlt: string; 
    imageSrc: string; 
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