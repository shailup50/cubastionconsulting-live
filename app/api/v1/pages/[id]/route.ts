import { NextResponse, type NextRequest } from 'next/server';
import { query, queryOne, update, remove } from '@/lib/db';
import type { Page } from '@/types/entities';
import type { RouteContext, IdParams } from '@/types/api';

export async function GET(_request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const page = await queryOne<Page>('SELECT * FROM mst_pagedata WHERE StaticPageID = ?', [id]);
    if (!page) return NextResponse.json({ status: false, message: 'Page not found' }, { status: 404 });
    return NextResponse.json({ status: true, data: page });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching page', error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const page = await queryOne<Page>('SELECT * FROM mst_pagedata WHERE StaticPageID = ?', [id]);
    if (!page) return NextResponse.json({ status: false, message: 'Page not found' }, { status: 404 });
    const body = await request.json();
    if (body.StaticPageNameURL) {
      const existing = await query('SELECT StaticPageID FROM mst_pagedata WHERE StaticPageNameURL = ? AND StaticPageID != ?', [body.StaticPageNameURL, id]);
      if (existing.length) return NextResponse.json({ status: false, message: 'Page URL already exists' }, { status: 422 });
    }
    const data: Record<string, unknown> = {};
    ['StaticPageName', 'StaticPageNameURL', 'StaticPageImage', 'SmallDescription', 'Description', 'ActiveStatus', 'MetaTitle', 'MetaKeywords', 'MetaDescriptions', 'MetaSchema'].forEach(f => { if (body[f] !== undefined) data[f] = body[f]; });
    data.UpdatedBy = body.UpdatedBy || 'admin';
    await update('mst_pagedata', data, 'StaticPageID = ?', [id]);
    const updated = await queryOne<Page>('SELECT * FROM mst_pagedata WHERE StaticPageID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Page updated successfully', data: updated });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error updating page', error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const page = await queryOne<Page>('SELECT * FROM mst_pagedata WHERE StaticPageID = ?', [id]);
    if (!page) return NextResponse.json({ status: false, message: 'Page not found' }, { status: 404 });
    await remove('mst_pagedata', 'StaticPageID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Page deleted successfully' });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error deleting page', error: (error as Error).message }, { status: 500 });
  }
}
