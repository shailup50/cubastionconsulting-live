import { NextResponse, type NextRequest } from 'next/server';
import { query } from '@/lib/db';
import type { Industry } from '@/types/entities';

export async function GET(_request: NextRequest) {
  try {
    const industries = await query<Industry>('SELECT * FROM mst_industrydata WHERE ActiveStatus = 1 AND DisplayOnHome = 1 ORDER BY DisplayOrder ASC');
    return NextResponse.json({ status: true, data: industries });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to fetch home industries', error: (error as Error).message }, { status: 500 });
  }
}
