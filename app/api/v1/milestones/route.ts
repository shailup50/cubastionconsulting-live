import { NextResponse, type NextRequest } from 'next/server';
import { query, insert } from '@/lib/db';
import type { Milestone } from '@/types/entities';

export async function GET(_request: NextRequest) {
  try {
    const milestones = await query<Milestone>('SELECT * FROM mst_milestonedata ORDER BY MilestoneID DESC');
    return NextResponse.json({ status: true, data: milestones });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to fetch milestones', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { Title, ActiveStatus } = body;
    if (!Title || ActiveStatus === undefined) {
      return NextResponse.json({ status: false, message: 'Title and ActiveStatus are required' }, { status: 422 });
    }
    const data: Record<string, unknown> = {};
    ['Title','Description','MilestoneYear','ActiveStatus','DisplayOrder'].forEach(f => { if (body[f] !== undefined) data[f] = body[f]; });
    data.PostedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    data.UpdatedBy = body.UpdatedBy || 'Admin';
    const result = await insert('mst_milestonedata', data);
    const milestone = await query<Milestone>('SELECT * FROM mst_milestonedata WHERE MilestoneID = ?', [result.insertId]);
    return NextResponse.json({ status: true, message: 'Milestone created successfully', data: milestone[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Something went wrong while creating milestone', error: (error as Error).message }, { status: 500 });
  }
}
