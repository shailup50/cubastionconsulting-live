import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const portfolios = await query(
      `SELECT p.*, a.AuthorName, a.AuthorTaglin, a.AuthorImage, i.IndustryName, i.IndustryNameURL
       FROM mst_portfoliodata p
       LEFT JOIN mst_authordata a ON p.AuthorID = a.AuthorID
       LEFT JOIN mst_industrydata i ON p.IndustryID = i.IndustryID
       WHERE p.IndustryID = ? AND p.ActiveStatus = 1
       ORDER BY p.DisplayOrder ASC`, [id]
    );
    for (const p of portfolios) {
      p.highlights = await query('SELECT * FROM mst_portfoliohighlightdata WHERE PortfolioID = ?', [p.PortfolioID]);
    }
    const data = portfolios.map(p => {
      const { AuthorName, AuthorTaglin, AuthorImage, IndustryName, IndustryNameURL, ...rest } = p;
      return { ...rest, author: AuthorName ? { AuthorName, AuthorTaglin, AuthorImage } : null, industry: IndustryName ? { IndustryName, IndustryNameURL } : null };
    });
    return NextResponse.json({ status: true, data });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to fetch portfolios by industry', error: error.message }, { status: 500 });
  }
}
