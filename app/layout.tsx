"use client";

import React from 'react';
import localFont from 'next/font/local';
import './globals.css';

import Footer from './components/Footer';
import { usePathname } from 'next/navigation';
import { CartProvider } from './components/CartContext';
import dynamic from 'next/dynamic';

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




const Header = dynamic(() => import('./components/Header'), {
  ssr: false,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <CartProvider>
      <html lang="en">
        <body className="antialiased">
          {pathname !== '/about/ProductPage' && <Header />}
          <main>{children}</main>
          <Footer />
        </body>
      </html>
    </CartProvider>
  );
}

