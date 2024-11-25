import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
}

// GET: Fetch list of products
export async function GET() {
  try {
    const { rows }: { rows: Product[] } = await sql`SELECT * FROM products;`;
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST: Add a new product
export async function POST(req: NextRequest) {
  try {
    const { name, price, photo } = await req.json();
    console.log('Incoming data for POST:', { name, price, photo });

    if (!name || typeof price !== 'number') {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      );
    }

    await sql`INSERT INTO products (name, price, image_url) VALUES (${name}, ${price}, ${photo || null});`;
    return NextResponse.json(
      { message: 'Product added successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a product by ID
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    console.log('Product ID for DELETE:', id);

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID not provided' },
        { status: 400 }
      );
    }

    await sql`DELETE FROM products WHERE id = ${id};`;
    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PATCH: Update product photo by ID
export async function PATCH(req: NextRequest) {
  try {
    const { id, photo } = await req.json(); 

    if (!id || !photo) {
      return NextResponse.json(
        { error: 'Product ID or photo URL not provided' },
        { status: 400 }
      );
    }

    await sql`UPDATE products SET image_url = ${photo} WHERE id = ${id};`;

    return NextResponse.json(
      { message: 'Product photo updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating product photo:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

