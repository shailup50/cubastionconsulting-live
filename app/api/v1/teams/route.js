import { NextResponse } from 'next/server';
import { query, insert } from '@/lib/db';

export async function GET() {
  try {
    const teams = await query('SELECT * FROM mst_teamdata ORDER BY TeamID DESC');
    return NextResponse.json({ status: true, data: teams });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to fetch team data', error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { TeamName, TeamDesignation, TeamBio, ActiveStatus } = body;
    if (!TeamName || !TeamDesignation || !TeamBio || ActiveStatus === undefined) {
      return NextResponse.json({ status: false, message: 'TeamName, TeamDesignation, TeamBio, ActiveStatus are required' }, { status: 422 });
    }
    const data = {};
    ['TeamName','TeamDesignation','TeamBio','TeamImage','TeamType','TeamLinkedInLink','ActiveStatus','DisplayOrder'].forEach(f => { if (body[f] !== undefined) data[f] = body[f]; });
    data.PostedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    data.UpdatedBy = body.UpdatedBy || 'Admin';
    const result = await insert('mst_teamdata', data);
    const team = await query('SELECT * FROM mst_teamdata WHERE TeamID = ?', [result.insertId]);
    return NextResponse.json({ status: true, message: 'Team member created successfully', data: team[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Something went wrong while creating team member', error: error.message }, { status: 500 });
  }
}
