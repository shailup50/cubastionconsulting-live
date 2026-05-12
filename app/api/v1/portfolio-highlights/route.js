import { NextResponse } from 'next/server';
import { query, remove, bulkInsert } from '@/lib/db';

export async function GET() {
  try {
    const highlights = await query(
      `SELECT h.*, p.PortfolioName FROM mst_portfoliohighlightdata h
       LEFT JOIN mst_portfoliodata p ON h.PortfolioID = p.PortfolioID`
    );
    return NextResponse.json({ status: true, data: highlights });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to fetch highlights', error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { PortfolioID, Highlights } = body;
    if (!PortfolioID) return NextResponse.json({ status: false, message: 'PortfolioID is required' }, { status: 422 });
    await remove('mst_portfoliohighlightdata', 'PortfolioID = ?', [PortfolioID]);
    const highlights = Highlights || [];
    const insertData = highlights.filter(h => (h.Question || '').trim()).map(h => ({ PortfolioID, Question: h.Question }));
    if (!insertData.length) return NextResponse.json({ status: true, message: 'Old highlights deleted. No valid highlights to insert.' });
    await bulkInsert('mst_portfoliohighlightdata', insertData);
    return NextResponse.json({ status: true, message: 'Highlights deleted and added successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Something went wrong', error: error.message }, { status: 500 });
  }
}
