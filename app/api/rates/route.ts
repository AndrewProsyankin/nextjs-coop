import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

export interface Currency {
  CharCode: string;
  Name: string;
  Value: number;
  Nominal: number;
}

const BANK_URL = 'https://www.cbr-xml-daily.ru/daily_json.js';

export async function GET() {
  try {
    const response = await fetch(BANK_URL);

    if (!response.ok) {
      throw new Error('Failed to fetch currency data');
    }

    const data: any = await response.json();
    // const data: { Valute: Record<string, { CharCode: string; Name: string; Value: number }> } = await response.json();
    const currencies: Currency[] = Object.values(data.Valute).map((val: any) => ({
      CharCode: val.CharCode,
      Name: val.Name,
      Value: val.Value,
      Nominal: val.Nominal,
    }));

    return NextResponse.json(currencies, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=43200',
      },
    });
  } catch (error) {
    console.error('Error fetching currencies:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}