import { NextResponse } from 'next/server';
import { query, insert } from '@/lib/db';

export async function GET() {
  try {
    const authors = await query('SELECT * FROM mst_authordata ORDER BY AuthorID DESC');
    return NextResponse.json({ status: true, data: authors });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to fetch authors', error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { AuthorName, AuthorTaglin, AuthorImage, DisplayOrder, ActiveStatus } = body;
    if (!AuthorName || !AuthorTaglin || !AuthorImage || DisplayOrder === undefined || ActiveStatus === undefined) {
      return NextResponse.json({ status: false, message: 'AuthorName, AuthorTaglin, AuthorImage, DisplayOrder, and ActiveStatus are required' }, { status: 422 });
    }
    const result = await insert('mst_authordata', {
      AuthorName, AuthorTaglin, AuthorImage, DisplayOrder, ActiveStatus, PostedDate: new Date().toISOString().slice(0, 19).replace('T', ' ')
    });
    const author = await query('SELECT * FROM mst_authordata WHERE AuthorID = ?', [result.insertId]);
    return NextResponse.json({ status: true, message: 'Author created successfully', data: author[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Something went wrong while creating author', error: error.message }, { status: 500 });
  }
}
