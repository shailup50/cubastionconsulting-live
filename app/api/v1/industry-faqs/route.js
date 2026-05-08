import { NextResponse } from 'next/server';
import { query, remove, bulkInsert } from '@/lib/db';

export async function GET() {
  try {
    const faqs = await query(
      `SELECT f.*, i.IndustryName FROM mst_industryfaqdata f
       LEFT JOIN mst_industrydata i ON f.IndustryID = i.IndustryID`
    );
    return NextResponse.json({ status: true, data: faqs });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to fetch FAQs', error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { IndustryID, FAQs } = body;
    if (!IndustryID) return NextResponse.json({ status: false, message: 'IndustryID is required' }, { status: 422 });
    await remove('mst_industryfaqdata', 'IndustryID = ?', [IndustryID]);
    const faqs = FAQs || [];
    const insertData = faqs.filter(f => (f.Question || '').trim() || (f.Answer || '').trim()).map(f => ({ IndustryID, Question: f.Question, Answer: f.Answer }));
    if (!insertData.length) return NextResponse.json({ status: true, message: 'Old FAQs deleted. No valid FAQs to insert.' });
    await bulkInsert('mst_industryfaqdata', insertData);
    return NextResponse.json({ status: true, message: 'FAQs deleted and added successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Something went wrong', error: error.message }, { status: 500 });
  }
}
