import { NextResponse } from 'next/server';
import { query, queryOne, update } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const solution = await queryOne(
      `SELECT s.*, i.IndustryName FROM mst_industrysolutiondata s
       LEFT JOIN mst_industrydata i ON s.IndustryID = i.IndustryID
       WHERE s.IndustrySolutionID = ?`, [id]
    );
    if (!solution) return NextResponse.json({ status: false, message: 'Solution not found' }, { status: 404 });
    return NextResponse.json({ status: true, data: solution });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching solution', error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const solution = await queryOne('SELECT * FROM mst_industrysolutiondata WHERE IndustrySolutionID = ?', [id]);
    if (!solution) return NextResponse.json({ status: false, message: 'Solution not found' }, { status: 404 });
    const body = await req.json();
    const data = {};
    ['IndustryID', 'IndustrySolutionHeading', 'IndustrySolutionTagline', 'IndustrySolutionImage'].forEach(f => { if (body[f] !== undefined) data[f] = body[f]; });
    await update('mst_industrysolutiondata', data, 'IndustrySolutionID = ?', [id]);
    const updated = await queryOne('SELECT * FROM mst_industrysolutiondata WHERE IndustrySolutionID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Solution updated successfully', data: updated });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Something went wrong', error: error.message }, { status: 500 });
  }
}
