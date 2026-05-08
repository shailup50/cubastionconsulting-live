import { NextResponse } from 'next/server';
import { query, insert } from '@/lib/db';

export async function GET() {
  try {
    const portfolios = await query(
      `SELECT p.*, a.AuthorName, a.AuthorTaglin, a.AuthorImage, i.IndustryName, i.IndustryNameURL
       FROM mst_portfoliodata p
       LEFT JOIN mst_authordata a ON p.AuthorID = a.AuthorID
       LEFT JOIN mst_industrydata i ON p.IndustryID = i.IndustryID
       ORDER BY p.PortfolioID DESC`
    );
    const data = portfolios.map(p => {
      const { AuthorName, AuthorTaglin, AuthorImage, IndustryName, IndustryNameURL, ...rest } = p;
      return { ...rest, author: AuthorName ? { AuthorName, AuthorTaglin, AuthorImage } : null, industry: IndustryName ? { IndustryName, IndustryNameURL } : null };
    });
    return NextResponse.json({ status: true, data });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to fetch portfolios', error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { AuthorID, IndustryID, PortfolioName, PortfolioNameURL, PortfolioTopHeading, PortfolioImage, PortfolioBannerImage, DisplayOrder, ActiveStatus, DisplayOnHome } = body;
    if (!AuthorID || !IndustryID || !PortfolioName || !PortfolioNameURL || !PortfolioTopHeading || !PortfolioImage || !PortfolioBannerImage || DisplayOrder === undefined || ActiveStatus === undefined || DisplayOnHome === undefined) {
      return NextResponse.json({ status: false, message: 'Required fields missing' }, { status: 422 });
    }
    const existing = await query('SELECT PortfolioID FROM mst_portfoliodata WHERE PortfolioNameURL = ?', [PortfolioNameURL]);
    if (existing.length) return NextResponse.json({ status: false, message: 'This portfolio URL already exists' }, { status: 422 });
    const data = { ...body, PostedDate: new Date().toISOString().slice(0, 19).replace('T', ' ') };
    delete data.PortfolioID;
    const result = await insert('mst_portfoliodata', data);
    const portfolio = await query('SELECT * FROM mst_portfoliodata WHERE PortfolioID = ?', [result.insertId]);
    return NextResponse.json({ status: true, message: 'Portfolio created successfully', data: portfolio[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Something went wrong while creating portfolio', error: error.message }, { status: 500 });
  }
}
