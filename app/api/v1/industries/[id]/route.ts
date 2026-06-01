import { NextResponse, type NextRequest } from 'next/server';
import { query, queryOne, update, remove } from '@/lib/db';
import type { Industry, IndustryFaq, IndustrySolution } from '@/types/entities';
import type { RouteContext, IdParams } from '@/types/api';

export async function GET(_request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const industry = await queryOne<Industry>('SELECT * FROM mst_industrydata WHERE IndustryID = ?', [id]);
    if (!industry) return NextResponse.json({ status: false, message: 'Industry not found' }, { status: 404 });
    const faqs = await query<IndustryFaq>('SELECT * FROM mst_industryfaqdata WHERE IndustryID = ?', [id]);
    const solutions = await query<IndustrySolution>('SELECT * FROM mst_industrysolutiondata WHERE IndustryID = ?', [id]);
    (industry as any).faqs = faqs;
    (industry as any).solutions = solutions;
    return NextResponse.json({ status: true, data: industry });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching industry', error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const industry = await queryOne<Industry>('SELECT * FROM mst_industrydata WHERE IndustryID = ?', [id]);
    if (!industry) return NextResponse.json({ status: false, message: 'Industry not found' }, { status: 404 });
    const body = await request.json();
    if (body.IndustryNameURL) {
      const existing = await query('SELECT IndustryID FROM mst_industrydata WHERE IndustryNameURL = ? AND IndustryID != ?', [body.IndustryNameURL, id]);
      if (existing.length) return NextResponse.json({ status: false, message: 'This Industry URL already exists.' }, { status: 422 });
    }
    const data = { ...body };
    delete data.IndustryID;
    data.UpdatedBy = body.UpdatedBy || 'admin';
    data.UpdatedOn = new Date().toISOString().slice(0, 19).replace('T', ' ');
    await update('mst_industrydata', data, 'IndustryID = ?', [id]);
    const updated = await queryOne<Industry>('SELECT * FROM mst_industrydata WHERE IndustryID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Industry updated successfully', data: updated });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Something went wrong', error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const industry = await queryOne<Industry>('SELECT * FROM mst_industrydata WHERE IndustryID = ?', [id]);
    if (!industry) return NextResponse.json({ status: false, message: 'Industry not found' }, { status: 404 });
    await remove('mst_industrydata', 'IndustryID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Industry deleted successfully' });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to delete industry', error: (error as Error).message }, { status: 500 });
  }
}
