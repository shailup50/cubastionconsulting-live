import { NextResponse } from 'next/server';
import { query, insert } from '@/lib/db';

export async function GET() {
  try {
    const logos = await query(
      'SELECT * FROM mst_logodata WHERE ActiveStatus IN (0, 1) ORDER BY LogoID DESC',
    );
    return NextResponse.json({ status: true, data: logos });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to fetch logos', error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { LogoName, LogoNameURL, LogoImage1, DisplayOrder, ActiveStatus } = body;
    if (!LogoName || !LogoNameURL || !LogoImage1 || DisplayOrder === undefined || ActiveStatus === undefined) {
      return NextResponse.json({ status: false, message: 'LogoName, LogoNameURL, LogoImage1, DisplayOrder, ActiveStatus are required' }, { status: 422 });
    }
    if (Number(ActiveStatus) === 2) {
      return NextResponse.json({ status: false, message: 'Use /api/v1/trusted-partners to create trusted partner logos' }, { status: 422 });
    }
    const existing = await query(
      'SELECT LogoID FROM mst_logodata WHERE LogoNameURL = ? AND ActiveStatus IN (0, 1)',
      [LogoNameURL],
    );
    if (existing.length) return NextResponse.json({ status: false, message: 'This logo URL already exists' }, { status: 422 });
    const result = await insert('mst_logodata', { LogoName, LogoNameURL, LogoImage1, DisplayOrder, ActiveStatus });
    const logo = await query('SELECT * FROM mst_logodata WHERE LogoID = ?', [result.insertId]);
    return NextResponse.json({ status: true, message: 'Logo created successfully', data: logo[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Something went wrong while creating logo', error: error.message }, { status: 500 });
  }
}
