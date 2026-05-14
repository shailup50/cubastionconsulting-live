import { NextResponse } from 'next/server';
import { query, remove } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { serviceId } = await params;
    const data = await query(
      `SELECT sc.*, c.CategoryName FROM mst_servicecategorydata sc
       LEFT JOIN mst_categorydata c ON sc.CategoryID = c.CategoryID
       WHERE sc.ServiceID = ?`, [serviceId]
    );
    return NextResponse.json({ status: true, data });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching categories for service', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { serviceId } = await params;
    const result = await remove('mst_servicecategorydata', 'ServiceID = ?', [serviceId]);
    return NextResponse.json({ status: true, message: result.affectedRows > 0 ? `${result.affectedRows} category mapping(s) removed successfully` : 'No categories found for this service' });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error deleting service categories', error: error.message }, { status: 500 });
  }
}
