import { NextResponse } from 'next/server';
import { query, queryOne, update, remove } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const page = await queryOne('SELECT * FROM mst_pagedata WHERE StaticPageID = ?', [id]);
    if (!page) return NextResponse.json({ status: false, message: 'Page not found' }, { status: 404 });
    return NextResponse.json({ status: true, data: page });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching page', error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const page = await queryOne('SELECT * FROM mst_pagedata WHERE StaticPageID = ?', [id]);
    if (!page) return NextResponse.json({ status: false, message: 'Page not found' }, { status: 404 });
    const body = await req.json();
    if (body.StaticPageNameURL) {
      const existing = await query('SELECT StaticPageID FROM mst_pagedata WHERE StaticPageNameURL = ? AND StaticPageID != ?', [body.StaticPageNameURL, id]);
      if (existing.length) return NextResponse.json({ status: false, message: 'Page URL already exists' }, { status: 422 });
    }
    const data = {};
    ['StaticPageName', 'StaticPageNameURL', 'StaticPageImage', 'SmallDescription', 'Description', 'ActiveStatus', 'MetaTitle', 'MetaKeywords', 'MetaDescriptions', 'MetaSchema'].forEach(f => { if (body[f] !== undefined) data[f] = body[f]; });
    data.UpdatedBy = body.UpdatedBy || 'admin';
    await update('mst_pagedata', data, 'StaticPageID = ?', [id]);
    const updated = await queryOne('SELECT * FROM mst_pagedata WHERE StaticPageID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Page updated successfully', data: updated });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error updating page', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const page = await queryOne('SELECT * FROM mst_pagedata WHERE StaticPageID = ?', [id]);
    if (!page) return NextResponse.json({ status: false, message: 'Page not found' }, { status: 404 });
    await remove('mst_pagedata', 'StaticPageID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Page deleted successfully' });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error deleting page', error: error.message }, { status: 500 });
  }
}
