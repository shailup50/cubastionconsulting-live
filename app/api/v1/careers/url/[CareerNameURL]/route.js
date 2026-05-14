import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { CareerNameURL } = await params;
    const data = await query('SELECT * FROM mst_careerdata WHERE CareerNameURL = ?', [CareerNameURL]);
    if (!data.length) return NextResponse.json({ status: false, message: 'Career not found' }, { status: 404 });
    return NextResponse.json({ status: true, data });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching career', error: error.message }, { status: 500 });
  }
}
