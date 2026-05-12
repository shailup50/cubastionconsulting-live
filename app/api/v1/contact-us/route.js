import { NextResponse } from 'next/server';
import { query, insert } from '@/lib/db';

export async function GET() {
  try {
    const contacts = await query('SELECT * FROM mst_contact_us ORDER BY ContactID DESC');
    return NextResponse.json({ status: true, data: contacts });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to fetch enquiries', error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { FullName, EmailID } = body;
    if (!FullName || !EmailID) {
      return NextResponse.json({ status: false, message: 'Full name and email are required' }, { status: 422 });
    }
    const data = {};
    ['FullName','EmailID','PhoneNo','NoOfGuest','Message','EnquiryType','EnquiryFor','PageName'].forEach(f => { if (body[f] !== undefined) data[f] = body[f]; });
    const result = await insert('mst_contact_us', data);
    const contact = await query('SELECT * FROM mst_contact_us WHERE ContactID = ?', [result.insertId]);
    return NextResponse.json({ status: true, message: 'Enquiry submitted successfully', data: contact[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Something went wrong while submitting enquiry', error: error.message }, { status: 500 });
  }
}
