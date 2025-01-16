import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import crypto from 'crypto';

async function initializeDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS user_registration (
        user_id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('Таблица user_registration проверена/создана.');
  } catch (error) {
    console.error('Ошибка при инициализации таблицы user_registration:', error);
  }
}

const hashPassword = (password: crypto.BinaryLike) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

export const POST = async (req: NextRequest) => {
  await initializeDatabase();

  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Параметры email и password обязательны' },
        { status: 400 }
      );
    }

    const password_hash = hashPassword(password); 

    try {
      const result = await sql`
        INSERT INTO user_registration (email, password_hash)
        VALUES (${email}, ${password_hash})
        RETURNING user_id, email;
      `;

      const user = result.rows[0];

      return NextResponse.json(
        { message: 'Пользователь успешно зарегистрирован', user_id: user.user_id },
        { status: 201 }
      );
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error) {
        const dbError = error as { code: string }; 
        if (dbError.code === '23505') {
          return NextResponse.json(
            { error: 'Email уже зарегистрирован' },
            { status: 400 }
          );
        }
      }
      console.error('Ошибка при регистрации пользователя:', error);
      return NextResponse.json(
        { error: 'Внутренняя ошибка сервера' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Ошибка при обработке запроса:', error);
    return NextResponse.json(
      { error: 'Ошибка при обработке запроса' },
      { status: 500 }
    );
  }
};
