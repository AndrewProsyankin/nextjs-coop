"use client";

import React from "react";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { usePathname } from "next/navigation";
import { CartProvider } from "./components/CartContext";
import LoadingSpinner from "./components/LoadingSpinner";
import useSWR from "swr";

const geistSans = localFont({
  src: "/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const fetcher = () => new Promise((resolve) => setTimeout(() => resolve(null), 900));

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const { isLoading } = useSWR("dummy-endpoint", fetcher, {
    revalidateOnFocus: false, 
  });

  if (isLoading) {
    return (
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <LoadingSpinner isLoading={true} color="blue" />
          </div>
        </body>
      </html>
    );
  }

  return (
    <CartProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {pathname !== "/about/ProductPage" &&
            pathname !== "/app/products/[id]/page.tsx" && <Header />}
          <main>{children}</main>
          <Footer />
        </body>
      </html>
    </CartProvider>
  );
}
