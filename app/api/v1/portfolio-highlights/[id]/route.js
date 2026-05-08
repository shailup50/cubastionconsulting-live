import { NextResponse } from 'next/server';
import { queryOne, update, remove } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const highlight = await queryOne('SELECT * FROM mst_portfoliohighlightdata WHERE PortfolioHighlightID = ?', [id]);
    if (!highlight) return NextResponse.json({ status: false, message: 'Highlight not found' }, { status: 404 });
    return NextResponse.json({ status: true, data: highlight });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching highlight', error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const highlight = await queryOne('SELECT * FROM mst_portfoliohighlightdata WHERE PortfolioHighlightID = ?', [id]);
    if (!highlight) return NextResponse.json({ status: false, message: 'Highlight not found' }, { status: 404 });
    const body = await req.json();
    const data = {};
    ['PortfolioID', 'Question'].forEach(f => { if (body[f] !== undefined) data[f] = body[f]; });
    await update('mst_portfoliohighlightdata', data, 'PortfolioHighlightID = ?', [id]);
    const updated = await queryOne('SELECT * FROM mst_portfoliohighlightdata WHERE PortfolioHighlightID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Highlight updated successfully', data: updated });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error updating highlight', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const highlight = await queryOne('SELECT * FROM mst_portfoliohighlightdata WHERE PortfolioHighlightID = ?', [id]);
    if (!highlight) return NextResponse.json({ status: false, message: 'Highlight not found' }, { status: 404 });
    await remove('mst_portfoliohighlightdata', 'PortfolioHighlightID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Highlight deleted successfully' });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error deleting highlight', error: error.message }, { status: 500 });
  }
}
