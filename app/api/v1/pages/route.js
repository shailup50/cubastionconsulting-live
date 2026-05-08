import { NextResponse } from 'next/server';
import { query, insert } from '@/lib/db';

export async function GET() {
  try {
    const pages = await query('SELECT * FROM mst_pagedata ORDER BY StaticPageID DESC');
    return NextResponse.json({ status: true, data: pages });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to fetch pages', error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { StaticPageName, ActiveStatus } = body;
    if (!StaticPageName || ActiveStatus === undefined) {
      return NextResponse.json({ status: false, message: 'StaticPageName and ActiveStatus are required' }, { status: 422 });
    }
    if (body.StaticPageNameURL) {
      const existing = await query('SELECT StaticPageID FROM mst_pagedata WHERE StaticPageNameURL = ?', [body.StaticPageNameURL]);
      if (existing.length) return NextResponse.json({ status: false, message: 'Page URL already exists' }, { status: 422 });
    }
    const data = {};
    ['StaticPageName', 'StaticPageNameURL', 'StaticPageImage', 'SmallDescription', 'Description', 'ActiveStatus', 'MetaTitle', 'MetaKeywords', 'MetaDescriptions', 'MetaSchema'].forEach(f => { if (body[f] !== undefined) data[f] = body[f]; });
    const result = await insert('mst_pagedata', data);
    const page = await query('SELECT * FROM mst_pagedata WHERE StaticPageID = ?', [result.insertId]);
    return NextResponse.json({ status: true, message: 'Page created successfully', data: page[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error creating page', error: error.message }, { status: 500 });
  }
}
