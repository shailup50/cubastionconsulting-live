import { NextResponse, type NextRequest } from 'next/server';
import { queryOne, update, remove } from '@/lib/db';
import type { Milestone } from '@/types/entities';
import type { RouteContext, IdParams } from '@/types/api';

export async function GET(_request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const milestone = await queryOne<Milestone>('SELECT * FROM mst_milestonedata WHERE MilestoneID = ?', [id]);
    if (!milestone) return NextResponse.json({ status: false, message: 'Milestone not found' }, { status: 404 });
    return NextResponse.json({ status: true, data: milestone });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching milestone', error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const milestone = await queryOne<Milestone>('SELECT * FROM mst_milestonedata WHERE MilestoneID = ?', [id]);
    if (!milestone) return NextResponse.json({ status: false, message: 'Milestone not found' }, { status: 404 });
    const body = await request.json();
    const data: Record<string, unknown> = {};
    ['Title','Description','MilestoneYear','ActiveStatus','DisplayOrder'].forEach(f => { if (body[f] !== undefined) data[f] = body[f]; });
    data.UpdatedBy = body.UpdatedBy || 'Admin';
    data.UpdatedOn = new Date().toISOString().slice(0, 19).replace('T', ' ');
    await update('mst_milestonedata', data, 'MilestoneID = ?', [id]);
    const updated = await queryOne<Milestone>('SELECT * FROM mst_milestonedata WHERE MilestoneID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Milestone updated successfully', data: updated });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Something went wrong while updating milestone', error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const milestone = await queryOne<Milestone>('SELECT * FROM mst_milestonedata WHERE MilestoneID = ?', [id]);
    if (!milestone) return NextResponse.json({ status: false, message: 'Milestone not found' }, { status: 404 });
    await remove('mst_milestonedata', 'MilestoneID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Milestone deleted successfully' });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to delete milestone', error: (error as Error).message }, { status: 500 });
  }
}
