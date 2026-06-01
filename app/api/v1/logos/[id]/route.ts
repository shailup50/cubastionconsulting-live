import { NextResponse, type NextRequest } from 'next/server';
import { query, queryOne, update, remove } from '@/lib/db';
import type { Logo } from '@/types/entities';
import type { RouteContext, IdParams } from '@/types/api';

export async function GET(_request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const logo = await queryOne<Logo>('SELECT * FROM mst_logodata WHERE LogoID = ? AND ActiveStatus IN (0, 1)', [id]);
    if (!logo) return NextResponse.json({ status: false, message: 'Logo not found' }, { status: 404 });
    return NextResponse.json({ status: true, data: logo });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching logo', error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const logo = await queryOne<Logo>('SELECT * FROM mst_logodata WHERE LogoID = ? AND ActiveStatus IN (0, 1)', [id]);
    if (!logo) return NextResponse.json({ status: false, message: 'Logo not found' }, { status: 404 });
    const body = await request.json();
    if (body.ActiveStatus !== undefined && Number(body.ActiveStatus) === 2) {
      return NextResponse.json({ status: false, message: 'Use /api/v1/trusted-partners for trusted partner logos' }, { status: 422 });
    }
    if (body.LogoNameURL) {
      const existing = await query('SELECT LogoID FROM mst_logodata WHERE LogoNameURL = ? AND LogoID != ?', [body.LogoNameURL, id]);
      if (existing.length) return NextResponse.json({ status: false, message: 'This logo URL already exists' }, { status: 422 });
    }
    const data: Record<string, unknown> = {};
    ['LogoName', 'LogoNameURL', 'LogoImage1', 'DisplayOrder', 'ActiveStatus'].forEach(f => { if (body[f] !== undefined) data[f] = body[f]; });
    data.UpdatedBy = body.UpdatedBy || 'admin';
    await update('mst_logodata', data, 'LogoID = ?', [id]);
    const updated = await queryOne<Logo>('SELECT * FROM mst_logodata WHERE LogoID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Logo updated successfully', data: updated });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Something went wrong while updating logo', error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const logo = await queryOne<Logo>('SELECT * FROM mst_logodata WHERE LogoID = ? AND ActiveStatus IN (0, 1)', [id]);
    if (!logo) return NextResponse.json({ status: false, message: 'Logo not found' }, { status: 404 });
    await remove('mst_logodata', 'LogoID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Logo deleted successfully' });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to delete logo', error: (error as Error).message }, { status: 500 });
  }
}
