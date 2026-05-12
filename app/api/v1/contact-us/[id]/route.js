import { NextResponse } from 'next/server';
import { queryOne, remove } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const contact = await queryOne('SELECT * FROM mst_contact_us WHERE ContactID = ?', [id]);
    if (!contact) return NextResponse.json({ status: false, message: 'Enquiry not found' }, { status: 404 });
    return NextResponse.json({ status: true, data: contact });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching enquiry', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const contact = await queryOne('SELECT * FROM mst_contact_us WHERE ContactID = ?', [id]);
    if (!contact) return NextResponse.json({ status: false, message: 'Enquiry not found' }, { status: 404 });
    await remove('mst_contact_us', 'ContactID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Enquiry deleted successfully' });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to delete enquiry', error: error.message }, { status: 500 });
  }
}
