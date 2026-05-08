import { NextResponse } from 'next/server';
import { queryOne, update, remove } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const milestone = await queryOne('SELECT * FROM mst_milestonedata WHERE MilestoneID = ?', [id]);
    if (!milestone) return NextResponse.json({ status: false, message: 'Milestone not found' }, { status: 404 });
    return NextResponse.json({ status: true, data: milestone });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching milestone', error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const milestone = await queryOne('SELECT * FROM mst_milestonedata WHERE MilestoneID = ?', [id]);
    if (!milestone) return NextResponse.json({ status: false, message: 'Milestone not found' }, { status: 404 });
    const body = await req.json();
    const data = {};
    ['Title','Description','MilestoneYear','ActiveStatus','DisplayOrder'].forEach(f => { if (body[f] !== undefined) data[f] = body[f]; });
    data.UpdatedBy = body.UpdatedBy || 'Admin';
    data.UpdatedOn = new Date().toISOString().slice(0, 19).replace('T', ' ');
    await update('mst_milestonedata', data, 'MilestoneID = ?', [id]);
    const updated = await queryOne('SELECT * FROM mst_milestonedata WHERE MilestoneID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Milestone updated successfully', data: updated });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Something went wrong while updating milestone', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const milestone = await queryOne('SELECT * FROM mst_milestonedata WHERE MilestoneID = ?', [id]);
    if (!milestone) return NextResponse.json({ status: false, message: 'Milestone not found' }, { status: 404 });
    await remove('mst_milestonedata', 'MilestoneID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Milestone deleted successfully' });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to delete milestone', error: error.message }, { status: 500 });
  }
}
