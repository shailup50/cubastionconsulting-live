import { NextResponse, type NextRequest } from 'next/server';
import { query } from '@/lib/db';

export async function GET(_request: NextRequest) {
  try {
    const portfolios = await query(
      `SELECT p.*, a.AuthorName, a.AuthorTaglin, a.AuthorImage, i.IndustryName, i.IndustryNameURL
       FROM mst_portfoliodata p
       LEFT JOIN mst_authordata a ON p.AuthorID = a.AuthorID
       LEFT JOIN mst_industrydata i ON p.IndustryID = i.IndustryID
       WHERE p.ActiveStatus = 1 AND p.DisplayOnHome = 1
       ORDER BY p.DisplayOrder ASC`
    );
    const data = portfolios.map((p: any) => {
      const { AuthorName, AuthorTaglin, AuthorImage, IndustryName, IndustryNameURL, ...rest } = p;
      return { ...rest, author: AuthorName ? { AuthorName, AuthorTaglin, AuthorImage } : null, industry: IndustryName ? { IndustryName, IndustryNameURL } : null };
    });
    return NextResponse.json({ status: true, data });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to fetch home portfolios', error: (error as Error).message }, { status: 500 });
  }
}
