import { NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';

export async function GET() {
  const maskedConfig = {
    DB_CONNECTION: process.env.DB_CONNECTION || null,
    DB_HOST: process.env.DB_HOST || null,
    DB_PORT: process.env.DB_PORT || null,
    DB_DATABASE: process.env.DB_DATABASE || null,
    DB_USERNAME: process.env.DB_USERNAME || null,
    DB_PASSWORD_SET: Boolean(process.env.DB_PASSWORD),
  };

  try {
    const ping = await queryOne('SELECT 1 AS ok');
    return NextResponse.json({
      status: true,
      message: 'Database connection successful',
      config: maskedConfig,
      ping,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        message: 'Database connection failed',
        config: maskedConfig,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
