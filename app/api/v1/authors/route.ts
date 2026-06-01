import { NextResponse, type NextRequest } from 'next/server';
import { query, insert } from '@/lib/db';
import type { Author } from '@/types/entities';

export async function GET(_request: NextRequest) {
  try {
    const authors = await query<Author>('SELECT * FROM mst_authordata ORDER BY AuthorID DESC');
    return NextResponse.json({ status: true, data: authors });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to fetch authors', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { AuthorName, AuthorTaglin, AuthorImage, DisplayOrder, ActiveStatus } = body;
    if (!AuthorName || !AuthorTaglin || !AuthorImage || DisplayOrder === undefined || ActiveStatus === undefined) {
      return NextResponse.json({ status: false, message: 'AuthorName, AuthorTaglin, AuthorImage, DisplayOrder, and ActiveStatus are required' }, { status: 422 });
    }
    const result = await insert('mst_authordata', {
      AuthorName, AuthorTaglin, AuthorImage, DisplayOrder, ActiveStatus, PostedDate: new Date().toISOString().slice(0, 19).replace('T', ' ')
    });
    const author = await query<Author>('SELECT * FROM mst_authordata WHERE AuthorID = ?', [result.insertId]);
    return NextResponse.json({ status: true, message: 'Author created successfully', data: author[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Something went wrong while creating author', error: (error as Error).message }, { status: 500 });
  }
}
