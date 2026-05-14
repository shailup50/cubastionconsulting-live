import { NextResponse } from 'next/server';
import { queryOne, update, remove } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const faq = await queryOne('SELECT * FROM mst_servicefaqdata WHERE ServiceFaqID = ?', [id]);
    if (!faq) return NextResponse.json({ status: false, message: 'FAQ not found' }, { status: 404 });
    return NextResponse.json({ status: true, data: faq });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching FAQ', error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const faq = await queryOne('SELECT * FROM mst_servicefaqdata WHERE ServiceFaqID = ?', [id]);
    if (!faq) return NextResponse.json({ status: false, message: 'FAQ not found' }, { status: 404 });
    const body = await req.json();
    const data = {};
    ['ServiceID', 'Question', 'Answer'].forEach(f => { if (body[f] !== undefined) data[f] = body[f]; });
    await update('mst_servicefaqdata', data, 'ServiceFaqID = ?', [id]);
    const updated = await queryOne('SELECT * FROM mst_servicefaqdata WHERE ServiceFaqID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Service FAQ updated successfully', data: updated });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error updating FAQ', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const faq = await queryOne('SELECT * FROM mst_servicefaqdata WHERE ServiceFaqID = ?', [id]);
    if (!faq) return NextResponse.json({ status: false, message: 'FAQ not found' }, { status: 404 });
    await remove('mst_servicefaqdata', 'ServiceFaqID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Service FAQ deleted successfully' });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error deleting FAQ', error: error.message }, { status: 500 });
  }
}
