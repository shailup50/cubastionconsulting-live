import { NextResponse, type NextRequest } from 'next/server';
import { query } from '@/lib/db';
import type { Career } from '@/types/entities';
import type { RouteContext } from '@/types/api';

export async function GET(_request: NextRequest, context: RouteContext<{ CareerNameURL: string }>) {
  try {
    const { CareerNameURL } = await context.params;
    const data = await query<Career>('SELECT * FROM mst_careerdata WHERE CareerNameURL = ?', [CareerNameURL]);
    if (!data.length) return NextResponse.json({ status: false, message: 'Career not found' }, { status: 404 });
    return NextResponse.json({ status: true, data });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching career', error: (error as Error).message }, { status: 500 });
  }
}
