import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const industries = await query('SELECT * FROM mst_industrydata WHERE ActiveStatus = 1 AND DisplayOnHome = 1 ORDER BY DisplayOrder ASC');
    return NextResponse.json({ status: true, data: industries });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to fetch home industries', error: error.message }, { status: 500 });
  }
}
