import { NextResponse } from 'next/server';
import { queryOne, remove } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const application = await queryOne('SELECT * FROM mst_career WHERE CareerID = ?', [id]);
    if (!application) return NextResponse.json({ status: false, message: 'Application not found' }, { status: 404 });
    return NextResponse.json({ status: true, data: application });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching application', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const application = await queryOne('SELECT * FROM mst_career WHERE CareerID = ?', [id]);
    if (!application) return NextResponse.json({ status: false, message: 'Application not found' }, { status: 404 });
    await remove('mst_career', 'CareerID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Application deleted successfully' });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error deleting application', error: error.message }, { status: 500 });
  }
}
