import { NextResponse } from 'next/server';
import { query, queryOne, update, remove } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const portfolio = await queryOne(
      `SELECT p.*, a.AuthorName, a.AuthorTaglin, a.AuthorImage, i.IndustryName, i.IndustryNameURL
       FROM mst_portfoliodata p
       LEFT JOIN mst_authordata a ON p.AuthorID = a.AuthorID
       LEFT JOIN mst_industrydata i ON p.IndustryID = i.IndustryID
       WHERE p.PortfolioID = ?`, [id]
    );
    if (!portfolio) return NextResponse.json({ status: false, message: 'Portfolio not found' }, { status: 404 });
    const highlights = await query('SELECT * FROM mst_portfoliohighlightdata WHERE PortfolioID = ?', [id]);
    const { AuthorName, AuthorTaglin, AuthorImage, IndustryName, IndustryNameURL, ...rest } = portfolio;
    return NextResponse.json({ status: true, data: { ...rest, author: AuthorName ? { AuthorName, AuthorTaglin, AuthorImage } : null, industry: IndustryName ? { IndustryName, IndustryNameURL } : null, highlights } });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching portfolio', error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const portfolio = await queryOne('SELECT * FROM mst_portfoliodata WHERE PortfolioID = ?', [id]);
    if (!portfolio) return NextResponse.json({ status: false, message: 'Portfolio not found' }, { status: 404 });
    const body = await req.json();
    if (body.PortfolioNameURL) {
      const existing = await query('SELECT PortfolioID FROM mst_portfoliodata WHERE PortfolioNameURL = ? AND PortfolioID != ?', [body.PortfolioNameURL, id]);
      if (existing.length) return NextResponse.json({ status: false, message: 'This portfolio URL already exists' }, { status: 422 });
    }
    const data = { ...body };
    delete data.PortfolioID;
    data.UpdatedBy = body.UpdatedBy || 'admin';
    data.UpdatedOn = new Date().toISOString().slice(0, 19).replace('T', ' ');
    await update('mst_portfoliodata', data, 'PortfolioID = ?', [id]);
    const updated = await queryOne('SELECT * FROM mst_portfoliodata WHERE PortfolioID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Portfolio updated successfully', data: updated });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Something went wrong while updating portfolio', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const portfolio = await queryOne('SELECT * FROM mst_portfoliodata WHERE PortfolioID = ?', [id]);
    if (!portfolio) return NextResponse.json({ status: false, message: 'Portfolio not found' }, { status: 404 });
    await remove('mst_portfoliodata', 'PortfolioID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Portfolio deleted successfully' });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to delete portfolio', error: error.message }, { status: 500 });
  }
}
