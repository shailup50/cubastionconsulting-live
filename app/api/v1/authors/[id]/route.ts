import { NextResponse, type NextRequest } from 'next/server';
import { queryOne, update, remove } from '@/lib/db';
import type { Author } from '@/types/entities';
import type { RouteContext, IdParams } from '@/types/api';

export async function GET(_request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const author = await queryOne<Author>('SELECT * FROM mst_authordata WHERE AuthorID = ?', [id]);
    if (!author) return NextResponse.json({ status: false, message: 'Author not found' }, { status: 404 });
    return NextResponse.json({ status: true, data: author });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching author', error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const author = await queryOne<Author>('SELECT * FROM mst_authordata WHERE AuthorID = ?', [id]);
    if (!author) return NextResponse.json({ status: false, message: 'Author not found' }, { status: 404 });
    const body = await request.json();
    const data: Record<string, unknown> = {};
    ['AuthorName', 'AuthorTaglin', 'AuthorImage', 'DisplayOrder', 'ActiveStatus'].forEach(f => { if (body[f] !== undefined) data[f] = body[f]; });
    data.UpdatedBy = body.UpdatedBy || 'admin';
    data.UpdatedOn = new Date().toISOString().slice(0, 19).replace('T', ' ');
    await update('mst_authordata', data, 'AuthorID = ?', [id]);
    const updated = await queryOne<Author>('SELECT * FROM mst_authordata WHERE AuthorID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Author updated successfully', data: updated });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Something went wrong while updating author', error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const author = await queryOne<Author>('SELECT * FROM mst_authordata WHERE AuthorID = ?', [id]);
    if (!author) return NextResponse.json({ status: false, message: 'Author not found' }, { status: 404 });
    await remove('mst_authordata', 'AuthorID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Author deleted successfully' });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to delete author', error: (error as Error).message }, { status: 500 });
  }
}
