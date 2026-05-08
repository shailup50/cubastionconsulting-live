import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { url } = await params;
    const industry = await queryOne('SELECT * FROM mst_industrydata WHERE IndustryNameURL = ?', [url]);
    if (!industry) return NextResponse.json({ status: false, message: 'Industry not found' }, { status: 404 });
    const faqs = await query('SELECT * FROM mst_industryfaqdata WHERE IndustryID = ?', [industry.IndustryID]);
    const solutions = await query('SELECT * FROM mst_industrysolutiondata WHERE IndustryID = ?', [industry.IndustryID]);
    const portfolios = await query(
      `SELECT p.*, a.AuthorName, a.AuthorTaglin, a.AuthorImage FROM mst_portfoliodata p
       LEFT JOIN mst_authordata a ON p.AuthorID = a.AuthorID
       WHERE p.IndustryID = ? AND p.ActiveStatus = 1 ORDER BY p.DisplayOrder ASC`,
      [industry.IndustryID]
    );
    industry.faqs = faqs;
    industry.solutions = solutions;
    industry.portfolios = portfolios.map(p => {
      const { AuthorName, AuthorTaglin, AuthorImage, ...rest } = p;
      return { ...rest, author: AuthorName ? { AuthorName, AuthorTaglin, AuthorImage } : null };
    });
    return NextResponse.json({ status: true, data: industry });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching industry', error: error.message }, { status: 500 });
  }
}
