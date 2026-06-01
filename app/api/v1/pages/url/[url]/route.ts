import { NextResponse, type NextRequest } from 'next/server';
import { queryOne } from '@/lib/db';
import type { Page } from '@/types/entities';
import type { RouteContext, UrlParams } from '@/types/api';

export async function GET(_request: NextRequest, context: RouteContext<UrlParams>) {
  try {
    const { url } = await context.params;
    const page = await queryOne<Page>('SELECT * FROM mst_pagedata WHERE StaticPageNameURL = ? AND ActiveStatus = 1', [url]);
    if (!page) return NextResponse.json({ status: false, message: 'Page not found' }, { status: 404 });
    return NextResponse.json({ status: true, data: page });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching page', error: (error as Error).message }, { status: 500 });
  }
}
