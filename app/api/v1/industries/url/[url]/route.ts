import { NextResponse, type NextRequest } from 'next/server';
import { query, queryOne } from '@/lib/db';
import type { Industry, IndustryFaq, IndustrySolution } from '@/types/entities';
import type { RouteContext, UrlParams } from '@/types/api';

export async function GET(_request: NextRequest, context: RouteContext<UrlParams>) {
  try {
    const { url } = await context.params;
    const industry = await queryOne<Industry>('SELECT * FROM mst_industrydata WHERE IndustryNameURL = ?', [url]);
    if (!industry) return NextResponse.json({ status: false, message: 'Industry not found' }, { status: 404 });
    const faqs = await query<IndustryFaq>('SELECT * FROM mst_industryfaqdata WHERE IndustryID = ?', [industry.IndustryID]);
    const solutions = await query<IndustrySolution>('SELECT * FROM mst_industrysolutiondata WHERE IndustryID = ?', [industry.IndustryID]);
    const portfolios = await query(
      `SELECT p.*, a.AuthorName, a.AuthorTaglin, a.AuthorImage FROM mst_portfoliodata p
       LEFT JOIN mst_authordata a ON p.AuthorID = a.AuthorID
       WHERE p.IndustryID = ? AND p.ActiveStatus = 1 ORDER BY p.DisplayOrder ASC`,
      [industry.IndustryID]
    );
    (industry as any).faqs = faqs;
    (industry as any).solutions = solutions;
    (industry as any).portfolios = portfolios.map((p: any) => {
      const { AuthorName, AuthorTaglin, AuthorImage, ...rest } = p;
      return { ...rest, author: AuthorName ? { AuthorName, AuthorTaglin, AuthorImage } : null };
    });
    return NextResponse.json({ status: true, data: industry });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching industry', error: (error as Error).message }, { status: 500 });
  }
}
