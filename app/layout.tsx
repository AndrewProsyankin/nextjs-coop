"use client"; // Add this line at the top

import React, { useState } from 'react';
import localFont from 'next/font/local';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { usePathname } from 'next/navigation';

// Load custom fonts
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

// Cart item interface definition
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageSrc: string;
  imageAlt: string;
  color: string;
}

// Root layout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode; // Explicitly define the type for children
}) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]); // State for cart items
  const pathname = usePathname();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Conditionally render Header only if we are not on the ProductPage */}
        {pathname !== '/about/ProductPage' && <Header cartItems={cartItems} setCartItems={setCartItems} />}
        
        {/* Pass down cart state as props to pages */}
        <main>{React.cloneElement(children as React.ReactElement, { cartItems, setCartItems })}</main>
        <Footer />
      </body>
    </html>
  );
}
