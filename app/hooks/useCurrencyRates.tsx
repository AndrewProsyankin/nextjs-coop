import useSWR from "swr";

export interface Currency {
  CharCode: string;
  Name: string;
  Value: number;
  Nominal: number;
}

const fetcher = async (url: string): Promise<Currency[]> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch current rates");
  }
  return response.json();
};

export const useCurrencyRates = () => {
  const { data, error, isLoading, mutate } = useSWR<Currency[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/rates`,
    fetcher,
    {
      revalidateOnFocus: false,
      fallbackData: [],
    }
  );

  const currencyObject =
    data?.reduce((acc, currency) => {
      acc[currency.CharCode] = currency;
      return acc;
    }, {} as { [key: string]: Currency }) ?? {};

  return { currencyObject, isLoading, error, mutate };
};
