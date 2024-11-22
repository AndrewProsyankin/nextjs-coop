'use client';
import { createContext, ReactNode, useContext, useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  imageAlt: string;
  isAvailable: boolean;  // Добавим поле для состояния товара
}

interface CartItem extends Product {
  quantity: number;
  color: string;
  price: number;
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
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const products: Product[] = await response.json();
      const productIds = products.map((product) => product.id);
      const updatedCart = cartItems.filter((item) => productIds.includes(item.id) && item.isAvailable); // фильтруем по доступности
      setCartItems(updatedCart);
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      }
    } catch (error) {
      console.error('Error syncing cart with API:', error);
    }
  };

  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      let updatedCart;

      if (existingItem) {
        updatedCart = prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedCart = [...prevItems, { ...product, quantity: 1, color: '', price: product.price }];
      }

      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      }
      return updatedCart;
    });
    syncCartWithAPI();
  };

  const removeFromCart = (id: number) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0);

      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      }
      return updatedCart;
    });
    syncCartWithAPI();
  };

  const updateCartItem = (id: number, quantity: number) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems.map((item) => {
        if (item.id === id) {
          if (!item.isAvailable) {  // Если товар не доступен, удаляем его
            return null;
          }
          return { ...item, quantity: quantity > 0 ? quantity : 1 };
        }
        return item;
      }).filter((item) => item !== null);  // Убираем товары с состоянием null

      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      }
      return updatedCart;
    });
    syncCartWithAPI();
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
