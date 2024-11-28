'use client';
import { createContext, ReactNode, useContext, useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  imageAlt: string;
  isAvailable: boolean;  // Product availability
}

interface CartItem extends Product {
  quantity: number;
  color: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  updateCartItem: (id: number, quantity: number) => void;
  clearCart: () => void;
  syncCartWithAPI: () => Promise<void>;
}

// Create the CartContext with a default value
export const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom hook to use the CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Helper function to get the initial cart items from localStorage
const getInitialCart = (): CartItem[] => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedCart = localStorage.getItem('cartItems');
    return storedCart ? JSON.parse(storedCart) : [];
  }
  return [];
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(getInitialCart);

  const syncCartWithAPI = async () => {
    try {
      const response = await fetch('/api/cart');
      if (!response.ok) throw new Error('Failed to fetch cart items');
      const cartFromAPI: CartItem[] = await response.json();
      setCartItems(cartFromAPI);

      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('cartItems', JSON.stringify(cartFromAPI));
      }
    } catch (error) {
      console.error('Error syncing cart with API:', error);
    }
  };

  const checkProductAvailability = async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`/api/products?id=${id}`);
      return response.ok;
    } catch (error) {
      console.error('Error checking product availability:', error);
      return false;
    }
  };

  const addToCart = async (product: Product) => {
    const isAvailable = await checkProductAvailability(product.id);
    if (!isAvailable) {
      alert('Product is no longer available');
      return;
    }

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

  const removeFromCart = async (id: number) => {
    const isAvailable = await checkProductAvailability(id);
    if (!isAvailable) {
      alert('Product is no longer available and has been removed from your cart');
    }

    setCartItems((prevItems) => {
      const updatedCart = prevItems.filter((item) => item.id !== id);

      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      }
      return updatedCart;
    });
  };

  const updateCartItem = async (id: number, quantity: number) => {
    const isAvailable = await checkProductAvailability(id);
    if (!isAvailable) {
      alert('Product is no longer available and has been removed from your cart');
      removeFromCart(id); 
      return;
    }

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
    syncCartWithAPI();
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        setCartItems,
        updateCartItem,
        removeFromCart,
        clearCart,
        syncCartWithAPI,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
