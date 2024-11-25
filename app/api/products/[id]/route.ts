import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
}

export async function PATCH(req: NextRequest) {
  try {
    const url = req.url;
    const idMatch = url.match(/\/api\/products\/(\d+)/); 

    if (!idMatch || idMatch[1] === undefined) {
      return NextResponse.json(
        { error: 'Product ID not provided in URL' },
        { status: 400 }
      );
    }

    const id = idMatch[1];
    const { photo } = await req.json(); 

    if (!photo) {
      return NextResponse.json(
        { error: 'Photo URL not provided' },
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
