import { NextResponse } from 'next/server';
import { query, insert } from '@/lib/db';

export async function GET() {
  try {
    const applications = await query('SELECT * FROM mst_career ORDER BY PostedDate DESC');
    return NextResponse.json({ status: true, total: applications.length, data: applications });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to fetch applications', error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { FullName, Email, PhoneNo, Country, City, LinkedInLink, Message, JobName, Resume } = body;
    if (!FullName || !Email || !PhoneNo || !Country || !City || !LinkedInLink || !Message || !JobName || !Resume) {
      return NextResponse.json({ status: false, message: 'All fields are required' }, { status: 422 });
    }
    const data = { FullName, Email, PhoneNo, Country, City, LinkedInLink, Resume, Message, JobName, PostedDate: new Date().toISOString().slice(0, 19).replace('T', ' ') };
    const result = await insert('mst_career', data);
    const application = await query('SELECT * FROM mst_career WHERE CareerID = ?', [result.insertId]);
    return NextResponse.json({ status: true, message: 'Application submitted successfully', data: application[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Something went wrong', error: error.message }, { status: 500 });
  }
}
