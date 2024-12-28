import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
}

// PATCH: 
export async function PATCH(req: NextRequest) {
  try {
    const { id, photo } = await req.json(); 

    if (!id || !photo) {
      return NextResponse.json(
        { error: 'Product ID or photo URL not provided' },
        { status: 400 }
      );
    }

    await `sqlUPDATE products SET image_url = ${photo} WHERE id = ${id}`;

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

// DELETE: 
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

    await `sqlDELETE FROM products WHERE id = ${id}`;
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

// GET:
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID not provided' },
        { status: 400 }
      );
    }

    const { rows } = await sql<Product[]>`
      SELECT id, name, price, image_url 
      FROM products 
      WHERE id = ${id};
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('Error fetching product details:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

