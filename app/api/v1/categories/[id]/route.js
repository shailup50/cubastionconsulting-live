import { NextResponse } from 'next/server';
import { query, queryOne, update, remove } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const category = await queryOne('SELECT * FROM mst_categorydata WHERE CategoryID = ?', [id]);
    if (!category) return NextResponse.json({ status: false, message: 'Category not found' }, { status: 404 });
    const services = await query(
      `SELECT s.* FROM mst_servicedata s
       INNER JOIN mst_servicecategorydata sc ON s.ServiceID = sc.ServiceID
       WHERE sc.CategoryID = ?`, [id]
    );
    category.services = services;
    return NextResponse.json({ status: true, data: category });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching category', error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const category = await queryOne('SELECT * FROM mst_categorydata WHERE CategoryID = ?', [id]);
    if (!category) return NextResponse.json({ status: false, message: 'Category not found' }, { status: 404 });
    const body = await req.json();
    const data = {};
    ['CategoryType', 'CategoryName', 'DisplayOrder', 'ActiveStatus'].forEach(f => { if (body[f] !== undefined) data[f] = body[f]; });
    data.UpdatedBy = body.UpdatedBy || 'admin';
    await update('mst_categorydata', data, 'CategoryID = ?', [id]);
    const updated = await queryOne('SELECT * FROM mst_categorydata WHERE CategoryID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Category updated successfully', data: updated });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error updating category', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const category = await queryOne('SELECT * FROM mst_categorydata WHERE CategoryID = ?', [id]);
    if (!category) return NextResponse.json({ status: false, message: 'Category not found' }, { status: 404 });
    await remove('mst_categorydata', 'CategoryID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Category deleted successfully' });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error deleting category', error: error.message }, { status: 500 });
  }
}
