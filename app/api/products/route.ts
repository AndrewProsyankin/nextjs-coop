import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export interface Product {
  id: number;
  name: string;
  price: number;
}

export async function GET() {
  try {
    const { rows }: { rows: Product[] } = await sql`SELECT * FROM products;`;

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, price } = await req.json();

    if (!name || typeof price !== 'number') {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      );
    }

    await sql`INSERT INTO products (name, price) VALUES (${name}, ${price});`;

    return NextResponse.json(
      { message: 'Product added successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
