"use client";

import React, { useEffect, useState } from 'react';
import localFont from 'next/font/local';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { usePathname } from 'next/navigation';
import { CartProvider } from './components/CartContext';
import { useCart } from './components/CartContext';
const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageSrc: string;
  imageAlt: string;
  color: string;
}

export default function RootLayout({

  children,
}: {
  children: React.ReactNode;
}) {
  // const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const pathname = usePathname();
  

  return (
  <CartProvider >
    <html lang="en">

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {pathname !== '/about/ProductPage' && <Header />}
        <main>{React.cloneElement(children as React.ReactElement)}</main>
        <Footer />
      </body>
    </html>
    </CartProvider>
  );
}
