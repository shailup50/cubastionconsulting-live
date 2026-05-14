import { NextResponse } from 'next/server';
import { query, queryOne, update, remove } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const industry = await queryOne('SELECT * FROM mst_industrydata WHERE IndustryID = ?', [id]);
    if (!industry) return NextResponse.json({ status: false, message: 'Industry not found' }, { status: 404 });
    const faqs = await query('SELECT * FROM mst_industryfaqdata WHERE IndustryID = ?', [id]);
    const solutions = await query('SELECT * FROM mst_industrysolutiondata WHERE IndustryID = ?', [id]);
    industry.faqs = faqs;
    industry.solutions = solutions;
    return NextResponse.json({ status: true, data: industry });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching industry', error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const industry = await queryOne('SELECT * FROM mst_industrydata WHERE IndustryID = ?', [id]);
    if (!industry) return NextResponse.json({ status: false, message: 'Industry not found' }, { status: 404 });
    const body = await req.json();
    if (body.IndustryNameURL) {
      const existing = await query('SELECT IndustryID FROM mst_industrydata WHERE IndustryNameURL = ? AND IndustryID != ?', [body.IndustryNameURL, id]);
      if (existing.length) return NextResponse.json({ status: false, message: 'This Industry URL already exists.' }, { status: 422 });
    }
    const data = { ...body };
    delete data.IndustryID;
    data.UpdatedBy = body.UpdatedBy || 'admin';
    data.UpdatedOn = new Date().toISOString().slice(0, 19).replace('T', ' ');
    await update('mst_industrydata', data, 'IndustryID = ?', [id]);
    const updated = await queryOne('SELECT * FROM mst_industrydata WHERE IndustryID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Industry updated successfully', data: updated });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Something went wrong', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const industry = await queryOne('SELECT * FROM mst_industrydata WHERE IndustryID = ?', [id]);
    if (!industry) return NextResponse.json({ status: false, message: 'Industry not found' }, { status: 404 });
    await remove('mst_industrydata', 'IndustryID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Industry deleted successfully' });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to delete industry', error: error.message }, { status: 500 });
  }
}
