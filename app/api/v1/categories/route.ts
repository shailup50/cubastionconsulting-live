import { NextResponse, type NextRequest } from 'next/server';
import { query, insert } from '@/lib/db';
import type { Category } from '@/types/entities';

export async function GET(_request: NextRequest) {
  try {
    const categories = await query<Category>('SELECT * FROM mst_categorydata ORDER BY CategoryID DESC');
    return NextResponse.json({ status: true, data: categories });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to fetch categories', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { CategoryType, CategoryName, DisplayOrder, ActiveStatus } = body;
    if (!CategoryType || !CategoryName || DisplayOrder === undefined || ActiveStatus === undefined) {
      return NextResponse.json({ status: false, message: 'CategoryType, CategoryName, DisplayOrder, and ActiveStatus are required' }, { status: 422 });
    }
    const result = await insert('mst_categorydata', {
      CategoryType, CategoryName, DisplayOrder, ActiveStatus, PostedDate: new Date().toISOString().slice(0, 19).replace('T', ' ')
    });
    const category = await query<Category>('SELECT * FROM mst_categorydata WHERE CategoryID = ?', [result.insertId]);
    return NextResponse.json({ status: true, message: 'Category created successfully', data: category[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error creating category', error: (error as Error).message }, { status: 500 });
  }
}
