import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
  gallery: string[];
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
    const { name, price, photo, gallery } = await req.json();
    console.log('Incoming data for POST:', { name, price, photo, gallery });

    if (!name || typeof price !== 'number') {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      );
    }

    await sql`INSERT INTO products (name, price, image_url, photoUrl) VALUES (${name}, ${price}, ${photo || null}, ${gallery || null});`;
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

// PATCH: Update product photo or gallery by ID
export async function PATCH(req: NextRequest) {
  try {
    const { id, photo, gallery } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    if (!photo && (!gallery || !Array.isArray(gallery) || gallery.length === 0)) {
      return NextResponse.json(
        { error: 'Either photo or gallery must be provided' },
        { status: 400 }
      );
    }

    // Update main photo
    if (photo) {
      if (typeof photo !== 'string' || !photo.startsWith('http')) {
        return NextResponse.json(
          { error: 'Photo URL must be a valid HTTP URL' },
          { status: 400 }
        );
      }

      await sql`UPDATE products SET image_url = ${photo} WHERE id = ${id};`;
      console.log(`Updated main product photo for product ID: ${id}`);
      return NextResponse.json(
        { message: 'Product photo updated successfully' },
        { status: 200 }
      );
    }

    // Update gallery
    if (gallery) {
      const invalidUrls = gallery.filter(
        (photoUrl: string) => typeof photoUrl !== 'string' || !photoUrl.startsWith('http')
      );

      if (invalidUrls.length > 0) {
        return NextResponse.json(
          { error: 'All gallery URLs must be valid HTTP URLs', invalidUrls },
          { status: 400 }
        );
      }

      // Delete existing gallery
      await sql`DELETE FROM product_gallery WHERE product_id = ${id};`;

      // Insert new gallery entries
      const insertPromises = gallery.map((photoUrl: string) =>
        sql`INSERT INTO product_gallery (product_id, image_url) VALUES (${id}, ${photoUrl});`
      );

      await Promise.all(insertPromises);

      console.log(`Updated gallery for product ID: ${id}`);
      return NextResponse.json(
        { message: 'Product gallery updated successfully' },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Error updating product photo or gallery:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
