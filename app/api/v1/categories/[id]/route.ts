import { NextResponse, type NextRequest } from 'next/server';
import { query, queryOne, update, remove } from '@/lib/db';
import type { Category, Service } from '@/types/entities';
import type { RouteContext, IdParams } from '@/types/api';

export async function GET(_request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const category = await queryOne<Category>('SELECT * FROM mst_categorydata WHERE CategoryID = ?', [id]);
    if (!category) return NextResponse.json({ status: false, message: 'Category not found' }, { status: 404 });
    const services = await query<Service>(
      `SELECT s.* FROM mst_servicedata s
       INNER JOIN mst_servicecategorydata sc ON s.ServiceID = sc.ServiceID
       WHERE sc.CategoryID = ?`, [id]
    );
    (category as any).services = services;
    return NextResponse.json({ status: true, data: category });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching category', error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const category = await queryOne<Category>('SELECT * FROM mst_categorydata WHERE CategoryID = ?', [id]);
    if (!category) return NextResponse.json({ status: false, message: 'Category not found' }, { status: 404 });
    const body = await request.json();
    const data: Record<string, unknown> = {};
    ['CategoryType', 'CategoryName', 'DisplayOrder', 'ActiveStatus'].forEach(f => { if (body[f] !== undefined) data[f] = body[f]; });
    data.UpdatedBy = body.UpdatedBy || 'admin';
    await update('mst_categorydata', data, 'CategoryID = ?', [id]);
    const updated = await queryOne<Category>('SELECT * FROM mst_categorydata WHERE CategoryID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Category updated successfully', data: updated });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error updating category', error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const category = await queryOne<Category>('SELECT * FROM mst_categorydata WHERE CategoryID = ?', [id]);
    if (!category) return NextResponse.json({ status: false, message: 'Category not found' }, { status: 404 });
    await remove('mst_categorydata', 'CategoryID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Category deleted successfully' });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error deleting category', error: (error as Error).message }, { status: 500 });
  }
}
