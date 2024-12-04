'use client';
import { createContext, ReactNode, useContext, useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  isAvailable: boolean;
  imageAlt: string; 
  imageSrc: string; 
}

interface CartItem extends Product {
  quantity: number;
  color: string;
  id: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCartOnDelete: (id: number) => void;
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  updateCartItem: (id: number, quantity: number) => void;
  clearCart: () => void;
}

// Create the CartContext
export const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom hook to use the CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Helper to get initial cart state from localStorage
const getInitialCart = (): CartItem[] => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedCart = localStorage.getItem('cartItems');
    return storedCart ? JSON.parse(storedCart) : [];
  }
  return [];
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(getInitialCart);

  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      let updatedCart;

      if (existingItem) {
        updatedCart = prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedCart = [...prevItems, { ...product, quantity: 1, color: '' }];
      }

      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      }
      return updatedCart;
    });
  };

  const removeFromCartOnDelete =  (id: number) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems.filter((item) => item.id !== id);
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      }
      return updatedCart;
    });
  
  };
  

  const updateCartItem = async(id: number, quantity: number) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      );

      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      }
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('cartItems');
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        setCartItems,
        updateCartItem,
        removeFromCartOnDelete,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
