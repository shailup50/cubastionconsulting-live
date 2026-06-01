import { NextResponse, type NextRequest } from 'next/server';
import { query } from '@/lib/db';
import type { RouteContext, IdParams } from '@/types/api';

export async function GET(_request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const portfolios = await query(
      `SELECT p.*, a.AuthorName, a.AuthorTaglin, a.AuthorImage, i.IndustryName, i.IndustryNameURL
       FROM mst_portfoliodata p
       LEFT JOIN mst_authordata a ON p.AuthorID = a.AuthorID
       LEFT JOIN mst_industrydata i ON p.IndustryID = i.IndustryID
       WHERE p.IndustryID = ? AND p.ActiveStatus = 1
       ORDER BY p.DisplayOrder ASC`, [id]
    );
    for (const p of portfolios) {
      (p as any).highlights = await query('SELECT * FROM mst_portfoliohighlightdata WHERE PortfolioID = ?', [(p as any).PortfolioID]);
    }
    const data = portfolios.map((p: any) => {
      const { AuthorName, AuthorTaglin, AuthorImage, IndustryName, IndustryNameURL, ...rest } = p;
      return { ...rest, author: AuthorName ? { AuthorName, AuthorTaglin, AuthorImage } : null, industry: IndustryName ? { IndustryName, IndustryNameURL } : null };
    });
    return NextResponse.json({ status: true, data });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to fetch portfolios by industry', error: (error as Error).message }, { status: 500 });
  }
}
