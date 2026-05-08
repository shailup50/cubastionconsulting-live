import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { url } = await params;
    const portfolio = await queryOne(
      `SELECT p.*, a.AuthorName, a.AuthorTaglin, a.AuthorImage, i.IndustryName, i.IndustryNameURL
       FROM mst_portfoliodata p
       LEFT JOIN mst_authordata a ON p.AuthorID = a.AuthorID
       LEFT JOIN mst_industrydata i ON p.IndustryID = i.IndustryID
       WHERE p.PortfolioNameURL = ?`, [url]
    );
    if (!portfolio) return NextResponse.json({ status: false, message: 'Portfolio not found' }, { status: 404 });
    const highlights = await query('SELECT * FROM mst_portfoliohighlightdata WHERE PortfolioID = ?', [portfolio.PortfolioID]);
    const { AuthorName, AuthorTaglin, AuthorImage, IndustryName, IndustryNameURL, ...rest } = portfolio;
    return NextResponse.json({ status: true, data: { ...rest, author: AuthorName ? { AuthorName, AuthorTaglin, AuthorImage } : null, industry: IndustryName ? { IndustryName, IndustryNameURL } : null, highlights } });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching portfolio', error: error.message }, { status: 500 });
  }
}
