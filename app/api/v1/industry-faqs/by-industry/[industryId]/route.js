import { NextResponse } from 'next/server';
import { query, remove } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { industryId } = await params;
    const faqs = await query('SELECT * FROM mst_industryfaqdata WHERE IndustryID = ?', [industryId]);
    return NextResponse.json({ status: true, data: faqs });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to fetch FAQs by industry', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { industryId } = await params;
    const faqs = await query('SELECT * FROM mst_industryfaqdata WHERE IndustryID = ?', [industryId]);
    if (!faqs.length) return NextResponse.json({ status: false, message: 'No FAQs found for this Industry' }, { status: 404 });
    await remove('mst_industryfaqdata', 'IndustryID = ?', [industryId]);
    return NextResponse.json({ status: true, message: 'All FAQs deleted successfully for this Industry' });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to delete FAQs', error: error.message }, { status: 500 });
  }
}
