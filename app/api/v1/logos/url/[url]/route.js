import { NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { url } = await params;
    const logo = await queryOne('SELECT * FROM mst_logodata WHERE LogoNameURL = ? AND ActiveStatus = 1', [url]);
    if (!logo) return NextResponse.json({ status: false, message: 'Logo not found' }, { status: 404 });
    return NextResponse.json({ status: true, data: logo });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching logo', error: error.message }, { status: 500 });
  }
}
