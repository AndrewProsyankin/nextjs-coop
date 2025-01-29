'use client'
import React, { createContext, useContext, useMemo, useState } from "react";
import { useCurrencyRates } from "../../hooks/useCurrencyRates";

export interface Currency {
  CharCode: string;
  Name: string;
  Value: number;
  Nominal: number;
}

type CurrencyContextType = {
  getConvertedPrice: (price: number | string, currencyCode: string) => string;
  selectedCurrency: string;
  setSelectedCurrency: (currencyCode: string) => void;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currencyObject } = useCurrencyRates();
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");

  const getConvertedPrice = useMemo(() => {
    return (price: number | string, currencyCode: string): string => {
      const numericPrice = typeof price === "string" ? parseFloat(price) : price;
  
      if (isNaN(numericPrice) || numericPrice < 0) {
        return "Invalid price";
      }
  
      const currency = currencyObject[currencyCode];
      if (!currency || typeof currency.Value !== "number" || typeof currency.Nominal !== "number") {
        return `${new Intl.NumberFormat("en-EN", {
          style: "decimal",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(numericPrice)} USD`;
      }
  
      const convertedPrice = numericPrice / (currency.Value / currency.Nominal);
  
      return `${new Intl.NumberFormat("en-EN", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(convertedPrice)} ${currency.CharCode}`;
    };
  }, [currencyObject]);
  

  return (
    <CurrencyContext.Provider
      value={{
        getConvertedPrice,
        selectedCurrency,
        setSelectedCurrency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useConvertedPrice = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useConvertedPrice must be used within a CurrencyProvider");
  }
  return context;
};
