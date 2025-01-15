import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
}

async function initializeDatabase() {
  try {
    console.log('Initializing database...');

    await sql`
      CREATE TABLE IF NOT EXISTS product_gallery (
        product_id INT NOT NULL,
        image_url TEXT NOT NULL,
        PRIMARY KEY (product_id, image_url),
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      );
    `;

    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initializeDatabase();

// PATCH: Update product photo and gallery by ID
export async function PATCH(req: NextRequest) {
  try {
    const { id, photo, gallery } = await req.json();
    console.log('Incoming PATCH request with data:', { id, photo, gallery });

    if (!id) {
      console.error('Error: Product ID is required');
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    if (photo) {
      if (typeof photo !== 'string' || !photo.startsWith('http')) {
        console.error('Invalid photo URL:', photo);
        return NextResponse.json(
          { error: 'Photo URL must be a valid HTTP URL' },
          { status: 400 }
        );
      }

      console.log(`Updating main photo for product ID: ${id} with URL: ${photo}`);
      await sql`
        UPDATE products
        SET image_url = ${photo}
        WHERE id = ${id};
      `;
    }

    if (gallery) {
      if (!Array.isArray(gallery) || gallery.length === 0) {
        console.error('Invalid gallery data:', gallery);
        return NextResponse.json(
          { error: 'Gallery must be a non-empty array of valid URLs' },
          { status: 400 }
        );
      }

      const invalidUrls = gallery.filter(
        (url: string) => typeof url !== 'string' || !url.startsWith('http')
      );

      if (invalidUrls.length > 0) {
        console.error('Invalid URLs in gallery:', invalidUrls);
        return NextResponse.json(
          { error: 'All gallery URLs must be valid HTTP URLs', invalidUrls },
          { status: 400 }
        );
      }

      const galleryUrls = gallery.map((url) => String(url));
      console.log(`Updating gallery for product ID: ${id} with URLs:`, galleryUrls);

      await sql`
        DELETE FROM product_gallery
        WHERE product_id = ${id};
      `;

      for (const url of galleryUrls) {
        await sql`
          INSERT INTO product_gallery (product_id, image_url)
          VALUES (${id}, ${url})
          ON CONFLICT (product_id, image_url) DO NOTHING;
        `;
      }
    }
    console.log('Product photo and gallery updated successfully for product ID:', id);
    return NextResponse.json(
      { message: 'Product photo and gallery updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating product photo and gallery:', error);
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
      SELECT 
        p.id, 
        p.name, 
        p.price, 
        p.image_url, 
        array_agg(pg.image_url) AS gallery
      FROM 
        products p
      LEFT JOIN 
        product_gallery pg 
      ON 
        p.id = pg.product_id
      WHERE 
        p.id = ${id}
      GROUP BY 
        p.id;
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

    await sql`
      DELETE FROM products WHERE id = ${id};
    `;
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

