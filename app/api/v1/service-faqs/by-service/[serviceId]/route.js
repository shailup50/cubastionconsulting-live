import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { serviceId } = await params;
    const faqs = await query('SELECT * FROM mst_servicefaqdata WHERE ServiceID = ?', [serviceId]);
    return NextResponse.json({ status: true, data: faqs });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching service FAQs', error: error.message }, { status: 500 });
  }
}
