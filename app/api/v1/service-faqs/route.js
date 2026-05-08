import { NextResponse } from 'next/server';
import { query, remove, bulkInsert } from '@/lib/db';

export async function GET() {
  try {
    const faqs = await query(
      `SELECT f.*, s.ServiceName FROM mst_servicefaqdata f
       LEFT JOIN mst_servicedata s ON f.ServiceID = s.ServiceID`
    );
    return NextResponse.json({ status: true, data: faqs });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to fetch service FAQs', error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { ServiceID, FAQs } = body;
    if (!ServiceID) return NextResponse.json({ status: false, message: 'ServiceID is required' }, { status: 422 });
    await remove('mst_servicefaqdata', 'ServiceID = ?', [ServiceID]);
    const faqs = FAQs || [];
    const insertData = faqs.filter(f => (f.Question || '').trim() || (f.Answer || '').trim()).map(f => ({ ServiceID, Question: f.Question, Answer: f.Answer }));
    if (!insertData.length) return NextResponse.json({ status: true, message: 'Old FAQs deleted. No valid FAQs to insert.' });
    await bulkInsert('mst_servicefaqdata', insertData);
    return NextResponse.json({ status: true, message: 'Service FAQs deleted and added successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Something went wrong', error: error.message }, { status: 500 });
  }
}
