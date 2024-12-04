import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
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

// DELETE: Delete a product by ID
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split('/').pop();

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: 'Valid Product ID not provided' },
        { status: 400 }
      );
    }

    // Удаляем товар только из таблицы `products`
    const productDeletionResult = await sql`DELETE FROM products WHERE id = ${id};`;

    if (productDeletionResult.rowCount === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

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


