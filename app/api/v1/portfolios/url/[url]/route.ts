import { NextResponse, type NextRequest } from 'next/server';
import { query, queryOne } from '@/lib/db';
import type { PortfolioHighlight } from '@/types/entities';
import type { RouteContext, UrlParams } from '@/types/api';

export async function GET(_request: NextRequest, context: RouteContext<UrlParams>) {
  try {
    const { url } = await context.params;
    const portfolio = await queryOne(
      `SELECT p.*, a.AuthorName, a.AuthorTaglin, a.AuthorImage, i.IndustryName, i.IndustryNameURL
       FROM mst_portfoliodata p
       LEFT JOIN mst_authordata a ON p.AuthorID = a.AuthorID
       LEFT JOIN mst_industrydata i ON p.IndustryID = i.IndustryID
       WHERE p.PortfolioNameURL = ?`, [url]
    );
    if (!portfolio) return NextResponse.json({ status: false, message: 'Portfolio not found' }, { status: 404 });
    const highlights = await query<PortfolioHighlight>('SELECT * FROM mst_portfoliohighlightdata WHERE PortfolioID = ?', [(portfolio as any).PortfolioID]);
    const { AuthorName, AuthorTaglin, AuthorImage, IndustryName, IndustryNameURL, ...rest } = portfolio as any;
    return NextResponse.json({ status: true, data: { ...rest, author: AuthorName ? { AuthorName, AuthorTaglin, AuthorImage } : null, industry: IndustryName ? { IndustryName, IndustryNameURL } : null, highlights } });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching portfolio', error: (error as Error).message }, { status: 500 });
  }
}
