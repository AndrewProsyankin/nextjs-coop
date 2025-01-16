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
    await sql`
      CREATE TABLE IF NOT EXISTS user_auth (
        session_id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        token TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        FOREIGN KEY (user_id) REFERENCES user_registration(user_id) ON DELETE CASCADE
      );
    `;
    console.log('Таблицы user_registration и user_auth проверены/созданы.');
  } catch (error) {
    console.error('Ошибка при инициализации таблиц:', error);
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

    const result = await sql<{
      user_id: number;
      password_hash: string;
    }>`SELECT user_id, password_hash FROM user_registration WHERE email = ${email};`;

    const user = result.rows[0];

    if (!user) {
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      );
    }

    const hashedPassword = hashPassword(password); 

    if (hashedPassword !== user.password_hash) {
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      );
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();

    await sql`
      INSERT INTO user_auth (user_id, token, expires_at)
      VALUES (${user.user_id}, ${token}, ${expiresAt});
    `;

    return NextResponse.json(
      { message: 'Авторизация успешна', token },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка в обработчике авторизации:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
};
