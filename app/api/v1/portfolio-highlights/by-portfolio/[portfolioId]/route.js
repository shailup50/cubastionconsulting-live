import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { portfolioId } = await params;
    const highlights = await query('SELECT * FROM mst_portfoliohighlightdata WHERE PortfolioID = ?', [portfolioId]);
    return NextResponse.json({ status: true, data: highlights });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching highlights', error: error.message }, { status: 500 });
  }
}
