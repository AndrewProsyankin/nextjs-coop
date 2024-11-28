import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string | null;
}

const CART_TABLE = 'cart_items';

export async function GET() {
  try {
    const { rows }: { rows: CartItem[] } = await sql`
      SELECT * FROM ${CART_TABLE};
    `;
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    try {
      const { id, name, price, quantity, image_url } = await req.json();
  
      if (!id || !name || !price || !quantity) {
        return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
      }
  
      const { rows: productRows } = await sql`
        SELECT * FROM products WHERE id = ${id};
      `;
  
      if (productRows.length === 0) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
  
      const product = productRows[0];
      if (product.quantity < quantity) {
        return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
      }
  
      await sql`
        INSERT INTO ${CART_TABLE} (id, name, price, quantity, image_url)
        VALUES (${id}, ${name}, ${price}, ${quantity}, ${image_url || null})
        ON CONFLICT (id) DO UPDATE SET quantity = ${CART_TABLE}.quantity + ${quantity};
      `;
  
      return NextResponse.json({ message: 'Item added to cart' }, { status: 201 });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
  
export async function PATCH(req: NextRequest) {
  try {
    const { id, quantity } = await req.json();

    if (!id || !quantity || quantity < 1) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }

    await sql`
      UPDATE ${CART_TABLE} SET quantity = ${quantity} WHERE id = ${id};
    `;

    return NextResponse.json({ message: 'Cart item updated' }, { status: 200 });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
