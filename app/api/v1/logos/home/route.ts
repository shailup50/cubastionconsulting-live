import { NextResponse, type NextRequest } from 'next/server';
import { query } from '@/lib/db';
import type { Logo } from '@/types/entities';

export async function GET(_request: NextRequest) {
  try {
    const logos = await query<Logo>('SELECT * FROM mst_logodata WHERE ActiveStatus = 1 AND DisplayOnHome = 1 ORDER BY DisplayOrder ASC');
    return NextResponse.json({ status: true, data: logos });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to fetch home logos', error: (error as Error).message }, { status: 500 });
  }
}
