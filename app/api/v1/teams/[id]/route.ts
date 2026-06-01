import { NextResponse, type NextRequest } from 'next/server';
import { queryOne, update, remove } from '@/lib/db';
import type { Team } from '@/types/entities';
import type { RouteContext, IdParams } from '@/types/api';

export async function GET(_request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const team = await queryOne<Team>('SELECT * FROM mst_teamdata WHERE TeamID = ?', [id]);
    if (!team) return NextResponse.json({ status: false, message: 'Team member not found' }, { status: 404 });
    return NextResponse.json({ status: true, data: team });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching team member', error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const team = await queryOne<Team>('SELECT * FROM mst_teamdata WHERE TeamID = ?', [id]);
    if (!team) return NextResponse.json({ status: false, message: 'Team member not found' }, { status: 404 });
    const body = await request.json();
    const data: Record<string, unknown> = {};
    ['TeamName','TeamDesignation','TeamBio','TeamImage','TeamType','TeamLinkedInLink','ActiveStatus','DisplayOrder'].forEach(f => { if (body[f] !== undefined) data[f] = body[f]; });
    data.UpdatedBy = body.UpdatedBy || 'Admin';
    data.UpdatedOn = new Date().toISOString().slice(0, 19).replace('T', ' ');
    await update('mst_teamdata', data, 'TeamID = ?', [id]);
    const updated = await queryOne<Team>('SELECT * FROM mst_teamdata WHERE TeamID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Team member updated successfully', data: updated });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Something went wrong while updating team member', error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const team = await queryOne<Team>('SELECT * FROM mst_teamdata WHERE TeamID = ?', [id]);
    if (!team) return NextResponse.json({ status: false, message: 'Team member not found' }, { status: 404 });
    await remove('mst_teamdata', 'TeamID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Team member deleted successfully' });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to delete team member', error: (error as Error).message }, { status: 500 });
  }
}
