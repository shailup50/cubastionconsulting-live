import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { url } = await params;
    const service = await queryOne('SELECT * FROM mst_servicedata WHERE ServiceNameURL = ? AND ActiveStatus = 1', [url]);
    if (!service) return NextResponse.json({ status: false, message: 'Service not found' }, { status: 404 });
    const faqs = await query('SELECT * FROM mst_servicefaqdata WHERE ServiceID = ?', [service.ServiceID]);
    const categories = await query(
      `SELECT c.* FROM mst_categorydata c
       INNER JOIN mst_servicecategorydata sc ON c.CategoryID = sc.CategoryID
       WHERE sc.ServiceID = ?`, [service.ServiceID]
    );
    service.faqs = faqs;
    service.categories = categories;
    return NextResponse.json({ status: true, data: service });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching service by URL', error: error.message }, { status: 500 });
  }
}
