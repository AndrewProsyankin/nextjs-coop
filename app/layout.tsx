"use client"; // Add this line at the top

import React, { useState } from 'react';
import localFont from 'next/font/local';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';

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

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header cartItems={cartItems} setCartItems={setCartItems} />
        {/* Main Content */}
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
