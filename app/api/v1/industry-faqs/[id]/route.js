import { NextResponse } from 'next/server';
import { queryOne, update } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const faq = await queryOne('SELECT * FROM mst_industryfaqdata WHERE IndustryFaqID = ?', [id]);
    if (!faq) return NextResponse.json({ status: false, message: 'FAQ not found' }, { status: 404 });
    return NextResponse.json({ status: true, data: faq });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching FAQ', error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const faq = await queryOne('SELECT * FROM mst_industryfaqdata WHERE IndustryFaqID = ?', [id]);
    if (!faq) return NextResponse.json({ status: false, message: 'FAQ not found' }, { status: 404 });
    const body = await req.json();
    const data = {};
    ['IndustryID', 'Question', 'Answer'].forEach(f => { if (body[f] !== undefined) data[f] = body[f]; });
    await update('mst_industryfaqdata', data, 'IndustryFaqID = ?', [id]);
    const updated = await queryOne('SELECT * FROM mst_industryfaqdata WHERE IndustryFaqID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Industry FAQ updated successfully', data: updated });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Something went wrong', error: error.message }, { status: 500 });
  }
}
