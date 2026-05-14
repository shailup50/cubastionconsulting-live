import { NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { url } = await params;
    const page = await queryOne('SELECT * FROM mst_pagedata WHERE StaticPageNameURL = ? AND ActiveStatus = 1', [url]);
    if (!page) return NextResponse.json({ status: false, message: 'Page not found' }, { status: 404 });
    return NextResponse.json({ status: true, data: page });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching page', error: error.message }, { status: 500 });
  }
}
