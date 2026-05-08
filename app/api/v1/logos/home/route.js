import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const logos = await query('SELECT * FROM mst_logodata WHERE ActiveStatus = 1 AND DisplayOnHome = 1 ORDER BY DisplayOrder ASC');
    return NextResponse.json({ status: true, data: logos });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to fetch home logos', error: error.message }, { status: 500 });
  }
}
