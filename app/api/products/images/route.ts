import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export interface Photo {
  id: number;
  url: string;
  product_id: number;
}

// Fetch photos or filter by product_id
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const productId = url.searchParams.get('productId');

    let query = sql<Photo>`SELECT * FROM photos`;
    if (productId) {
      query = sql<Photo>`SELECT * FROM photos WHERE product_id = ${productId}`;
    }
    const { rows } = await query;
console.log('Fetched photos:', rows); // Add this to check the query output


    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Add a new photo to the database
export async function POST(req: NextRequest) {
  try {
    const { url, product_id } = await req.json();

    if (!url || !product_id) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }

    await sql`INSERT INTO photos (url, product_id) VALUES (${url}, ${product_id})`;
    return NextResponse.json({ message: 'Photo added successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error adding photo:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Delete a photo by ID
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Photo ID is required' }, { status: 400 });
    }

    await sql`DELETE FROM photos WHERE id = ${id}`;
    return NextResponse.json({ message: 'Photo deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting photo:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
