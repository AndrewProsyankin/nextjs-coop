import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export interface Product {
  id: number;
  name: string;
  price: number;
  photo: string | null;
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

export async function DELETE(req: Request) {
  try{
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID продукта не указан' }, { status: 400 });
    }
      await sql`DELETE FROM products WHERE id = ${id};`;
      return NextResponse.json({ message: 'Продукт успешно удален' }, { status: 200 });
    } catch (error) {
      console.error('Ошибка при удалении продукта:', error);
      return NextResponse.json({ error: 'Ошибка при удалении продукта' }, { status: 500 });
    }
  }


export async function POST(req: NextRequest) {
  try {
    const { name, price, photo } = await req.json();

    if (!name || typeof price !== 'number') {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      );
    }
    
    await sql`INSERT INTO products (name, price, photo) VALUES (${name}, ${price}, ${photo || null});`;
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
export async function PATCH(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await sql`UPDATE products SET photo = NULL WHERE id = ${id};`;
    return NextResponse.json(
      { message: 'Photo successfully removed from product' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error removing photo:', error);
    return NextResponse.json(
      { error: 'Error removing photo from product' },
      { status: 500 }
    );
  }
}