import { NextResponse, type NextRequest } from 'next/server';
import { query, insert } from '@/lib/db';
import type { Team } from '@/types/entities';

export async function GET(_request: NextRequest) {
  try {
    const teams = await query<Team>('SELECT * FROM mst_teamdata ORDER BY TeamID DESC');
    return NextResponse.json({ status: true, data: teams });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to fetch team data', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { TeamName, TeamDesignation, TeamBio, ActiveStatus } = body;
    if (!TeamName || !TeamDesignation || !TeamBio || ActiveStatus === undefined) {
      return NextResponse.json({ status: false, message: 'TeamName, TeamDesignation, TeamBio, ActiveStatus are required' }, { status: 422 });
    }
    const data: Record<string, unknown> = {};
    ['TeamName','TeamDesignation','TeamBio','TeamImage','TeamType','TeamLinkedInLink','ActiveStatus','DisplayOrder'].forEach(f => { if (body[f] !== undefined) data[f] = body[f]; });
    data.PostedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    data.UpdatedBy = body.UpdatedBy || 'Admin';
    const result = await insert('mst_teamdata', data);
    const team = await query<Team>('SELECT * FROM mst_teamdata WHERE TeamID = ?', [result.insertId]);
    return NextResponse.json({ status: true, message: 'Team member created successfully', data: team[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Something went wrong while creating team member', error: (error as Error).message }, { status: 500 });
  }
}
