'use client'

import React from "react";
import localFont from "next/font/local";
import "app/globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { usePathname } from "next/navigation";
import { CartProvider } from "./components/CartContext";
import LoadingSpinner from "./components/LoadingSpinner";
import useSWR from "swr";
import { CurrencyProvider, Currency } from "./components/Currency/CurrencyContext";

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
interface RootLayoutProps {
  children: React.ReactNode;
  initialCurrencies: Currency[];
}

export default function RootLayout({
  children,
}: RootLayoutProps) {
  const pathname = usePathname();

  const { isLoading } = useSWR("dummy-endpoint", fetcher, {
    revalidateOnFocus: false,
  });
  
  return (
    <CurrencyProvider >
      <CartProvider>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            {pathname !== "/pages/ProductPage" && <Header />}
            <main>
              {isLoading ? (
                <div className="bg-gray-100 min-h-screen flex items-center justify-center">
                  <LoadingSpinner isLoading={true} color="blue" />
                </div>
              ) : (
                children
              )}
            </main>
            <Footer />
          </body>
        </html>
      </CartProvider>
    </CurrencyProvider>
  );
}
