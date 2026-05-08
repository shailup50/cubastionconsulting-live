import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { type } = await params;
    const teams = await query('SELECT * FROM mst_teamdata WHERE TeamType = ? AND ActiveStatus = 1 ORDER BY DisplayOrder ASC', [type]);
    return NextResponse.json({ status: true, data: teams });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to fetch team by type', error: error.message }, { status: 500 });
  }
}
