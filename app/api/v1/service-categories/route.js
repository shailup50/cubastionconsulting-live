import { NextResponse } from 'next/server';
import { query, remove, bulkInsert } from '@/lib/db';

export async function GET() {
  try {
    const categories = await query('SELECT CategoryID, CategoryName, CategoryType FROM mst_categorydata WHERE ActiveStatus = 1 ORDER BY DisplayOrder ASC');
    const services = await query('SELECT ServiceID, ServiceName, ServiceNameURL, ServiceImage FROM mst_servicedata WHERE ActiveStatus = 1 ORDER BY DisplayOrder ASC');
    const servicecategory = await query(
      `SELECT sc.*, s.ServiceName, c.CategoryName FROM mst_servicecategorydata sc
       LEFT JOIN mst_servicedata s ON sc.ServiceID = s.ServiceID
       LEFT JOIN mst_categorydata c ON sc.CategoryID = c.CategoryID`
    );
    const grouped = {};
    for (const cat of categories) {
      const type = cat.CategoryType || 'Other';
      if (!grouped[type]) grouped[type] = [];
      cat.services = await query(
        'SELECT s.* FROM mst_servicedata s INNER JOIN mst_servicecategorydata sc ON s.ServiceID = sc.ServiceID WHERE sc.CategoryID = ?', [cat.CategoryID]
      );
      grouped[type].push(cat);
    }
    return NextResponse.json({ status: true, questions: grouped, industries: services, servicecategory });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to fetch data', error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { ServiceID, CategoryIDs } = body;
    if (!ServiceID) return NextResponse.json({ status: false, message: 'ServiceID is required' }, { status: 422 });
    await remove('mst_servicecategorydata', 'ServiceID = ?', [ServiceID]);
    const categoryIds = [...new Set((CategoryIDs || []).filter(Boolean))];
    if (categoryIds.length) {
      const insertData = categoryIds.map(CategoryID => ({ ServiceID, CategoryID }));
      await bulkInsert('mst_servicecategorydata', insertData);
    }
    return NextResponse.json({ status: true, message: 'Service categories updated successfully' });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to update categories', error: error.message }, { status: 500 });
  }
}
