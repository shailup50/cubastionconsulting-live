import { NextResponse, type NextRequest } from 'next/server';
import { query, insert } from '@/lib/db';
import type { Industry } from '@/types/entities';

export async function GET(_request: NextRequest) {
  try {
    const industries = await query<Industry>('SELECT * FROM mst_industrydata ORDER BY IndustryID DESC');
    return NextResponse.json({ status: true, data: industries });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to fetch industries', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { IndustryName, IndustryNameURL, IndustryImage, IndustryBannerImage, ActiveStatus, DisplayOrder, DisplayOnHome } = body;
    if (!IndustryName || !IndustryNameURL || !IndustryImage || !IndustryBannerImage || ActiveStatus === undefined || DisplayOrder === undefined || DisplayOnHome === undefined) {
      return NextResponse.json({ status: false, message: 'Required fields missing' }, { status: 422 });
    }
    const existing = await query('SELECT IndustryID FROM mst_industrydata WHERE IndustryNameURL = ?', [IndustryNameURL]);
    if (existing.length) return NextResponse.json({ status: false, message: 'This Industry URL already exists.' }, { status: 422 });
    const data = { ...body, PostedDate: new Date().toISOString().slice(0, 19).replace('T', ' ') };
    delete data.IndustryID;
    const result = await insert('mst_industrydata', data);
    const industry = await query<Industry>('SELECT * FROM mst_industrydata WHERE IndustryID = ?', [result.insertId]);
    return NextResponse.json({ status: true, message: 'Industry created successfully', data: industry[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Something went wrong', error: (error as Error).message }, { status: 500 });
  }
}
