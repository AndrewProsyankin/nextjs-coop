'use client'
import { createContext, ReactNode, useContext, useState } from 'react';

// Define the structure of Product and CartItem
interface Product {
  id: number;
  name: string;
  price: number;
  imageSrc: string;
  imageAlt: string;
}

interface CartItem extends Product {
  quantity: number;
  color: string;
  price: number;
}

// Define the context state
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  updateCartItem: (id: number, quantity: number) => void; // Define updateCartItem here
  clearCart: () => void;
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
  if (typeof window !== 'undefined' && window.localStorage){
    const storedCart = localStorage.getItem('cartItems');
    return storedCart ? JSON.parse(storedCart) : [];
  }
  return [];
};

// CartProvider to wrap around components where the cart state is needed
export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Load cart items from local storage, or initialize as an empty array
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

      if (typeof window !== 'undefined' && window.localStorage){
      console.log('added to cart', JSON.stringify(updatedCart))
       localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      }
      return updatedCart;
    });
  };


  const removeFromCart = (id: number) => {
    setCartItems((prevItems) =>{
      const updatedCart = prevItems
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);

        if (typeof window !== 'undefined' && window.localStorage){
        console.log('removed from cart', JSON.stringify(updatedCart))
         localStorage.setItem('cartItems', JSON.stringify(updatedCart));
        }
      return updatedCart;
    });
  };


  const updateCartItem = (id: number, quantity: number) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems.map((item) =>
        item.id === id ? { ...item, quantity: quantity > 0 ? quantity : 1 } : item
      );
      console.log('updated cart', JSON.stringify(cartItems))
      if (typeof window !== 'undefined' && window.localStorage){
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      }
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    console.log('removed  all from cart', JSON.stringify(cartItems))

    if (typeof window !== 'undefined' && window.localStorage){
     localStorage.removeItem('cartItems');
    }
  };


  return (
    <CartContext.Provider value={{ cartItems, addToCart, setCartItems, updateCartItem, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
