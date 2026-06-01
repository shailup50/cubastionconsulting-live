import { NextResponse, type NextRequest } from 'next/server';
import { queryOne } from '@/lib/db';
import type { Logo } from '@/types/entities';
import type { RouteContext, UrlParams } from '@/types/api';

export async function GET(_request: NextRequest, context: RouteContext<UrlParams>) {
  try {
    const { url } = await context.params;
    const logo = await queryOne<Logo>('SELECT * FROM mst_logodata WHERE LogoNameURL = ? AND ActiveStatus = 1', [url]);
    if (!logo) return NextResponse.json({ status: false, message: 'Logo not found' }, { status: 404 });
    return NextResponse.json({ status: true, data: logo });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching logo', error: (error as Error).message }, { status: 500 });
  }
}
