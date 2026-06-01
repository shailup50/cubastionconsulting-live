import { NextResponse, type NextRequest } from 'next/server';
import { query, insert } from '@/lib/db';
import type { Career } from '@/types/entities';

export async function GET(_request: NextRequest) {
  try {
    const careers = await query<Career>('SELECT * FROM mst_careerdata ORDER BY CareerID DESC');
    return NextResponse.json({ status: true, data: careers });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to fetch careers', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { JobCategoryName, CareerName, CareerNameURL, CareerPosition, DisplayOrder, ActiveStatus } = body;
    if (!JobCategoryName || !CareerName || !CareerNameURL || !CareerPosition || DisplayOrder === undefined || ActiveStatus === undefined) {
      return NextResponse.json({ status: false, message: 'Required fields missing' }, { status: 422 });
    }
    const existing = await query('SELECT CareerID FROM mst_careerdata WHERE CareerNameURL = ?', [CareerNameURL]);
    if (existing.length) return NextResponse.json({ status: false, message: 'This career URL already exists' }, { status: 422 });
    const data: Record<string, unknown> = {};
    ['JobCategoryName','CareerName','CareerNameURL','CareerPosition','CareerLocation','CareerImage','CareerBannerImage','Description','DisplayOrder','ActiveStatus','MetaTitle','MetaKeywords','MetaDescriptions','MetaSchema'].forEach(f => { if (body[f] !== undefined) data[f] = body[f]; });
    data.PostedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const result = await insert('mst_careerdata', data);
    const career = await query<Career>('SELECT * FROM mst_careerdata WHERE CareerID = ?', [result.insertId]);
    return NextResponse.json({ status: true, message: 'Career created successfully', data: career[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Something went wrong', error: (error as Error).message }, { status: 500 });
  }
}
