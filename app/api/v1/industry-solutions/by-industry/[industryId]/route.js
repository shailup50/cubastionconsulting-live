import { NextResponse } from 'next/server';
import { query, remove } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { industryId } = await params;
    const solutions = await query('SELECT * FROM mst_industrysolutiondata WHERE IndustryID = ?', [industryId]);
    return NextResponse.json({ status: true, data: solutions });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to fetch solutions by industry', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { industryId } = await params;
    const solutions = await query('SELECT * FROM mst_industrysolutiondata WHERE IndustryID = ?', [industryId]);
    if (!solutions.length) return NextResponse.json({ status: false, message: 'No solutions found for this Industry' }, { status: 404 });
    await remove('mst_industrysolutiondata', 'IndustryID = ?', [industryId]);
    return NextResponse.json({ status: true, message: 'All Solutions deleted successfully for this Industry' });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to delete Solutions', error: error.message }, { status: 500 });
  }
}
