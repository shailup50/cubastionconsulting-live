import { NextResponse } from 'next/server';
import { queryOne, update, remove } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const team = await queryOne('SELECT * FROM mst_teamdata WHERE TeamID = ?', [id]);
    if (!team) return NextResponse.json({ status: false, message: 'Team member not found' }, { status: 404 });
    return NextResponse.json({ status: true, data: team });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching team member', error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const team = await queryOne('SELECT * FROM mst_teamdata WHERE TeamID = ?', [id]);
    if (!team) return NextResponse.json({ status: false, message: 'Team member not found' }, { status: 404 });
    const body = await req.json();
    const data = {};
    ['TeamName','TeamDesignation','TeamBio','TeamImage','TeamType','TeamLinkedInLink','ActiveStatus','DisplayOrder'].forEach(f => { if (body[f] !== undefined) data[f] = body[f]; });
    data.UpdatedBy = body.UpdatedBy || 'Admin';
    data.UpdatedOn = new Date().toISOString().slice(0, 19).replace('T', ' ');
    await update('mst_teamdata', data, 'TeamID = ?', [id]);
    const updated = await queryOne('SELECT * FROM mst_teamdata WHERE TeamID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Team member updated successfully', data: updated });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Something went wrong while updating team member', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const team = await queryOne('SELECT * FROM mst_teamdata WHERE TeamID = ?', [id]);
    if (!team) return NextResponse.json({ status: false, message: 'Team member not found' }, { status: 404 });
    await remove('mst_teamdata', 'TeamID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Team member deleted successfully' });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to delete team member', error: error.message }, { status: 500 });
  }
}
