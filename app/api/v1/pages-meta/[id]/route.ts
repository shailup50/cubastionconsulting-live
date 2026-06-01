import { NextResponse, type NextRequest } from 'next/server';
import { queryOne } from '@/lib/db';
import type { Page } from '@/types/entities';
import type { RouteContext, IdParams } from '@/types/api';

export async function GET(_request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const page = await queryOne<Page>('SELECT * FROM mst_pagedata WHERE StaticPageID = ?', [id]);
    if (!page) return NextResponse.json({ status: false, message: 'Page not found' }, { status: 404 });
    return NextResponse.json({ status: true, data: page });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching page metadata', error: (error as Error).message }, { status: 500 });
  }
}
