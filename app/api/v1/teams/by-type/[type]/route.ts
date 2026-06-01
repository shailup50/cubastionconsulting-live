import { NextResponse, type NextRequest } from 'next/server';
import { query } from '@/lib/db';
import type { Team } from '@/types/entities';
import type { RouteContext, TypeParams } from '@/types/api';

export async function GET(_request: NextRequest, context: RouteContext<TypeParams>) {
  try {
    const { type } = await context.params;
    const teams = await query<Team>('SELECT * FROM mst_teamdata WHERE TeamType = ? AND ActiveStatus = 1 ORDER BY DisplayOrder ASC', [type]);
    return NextResponse.json({ status: true, data: teams });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to fetch team by type', error: (error as Error).message }, { status: 500 });
  }
}
