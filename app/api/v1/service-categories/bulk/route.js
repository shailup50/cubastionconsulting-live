import { NextResponse } from 'next/server';
import { query, bulkInsert } from '@/lib/db';

export async function POST(req) {
  try {
    const body = await req.json();
    const { ServiceID, CategoryIDs } = body;
    if (!ServiceID || !CategoryIDs || !CategoryIDs.length) {
      return NextResponse.json({ status: false, message: 'ServiceID and at least one CategoryID are required' }, { status: 422 });
    }
    const newCategoryIds = [...new Set(CategoryIDs.filter(Boolean))];
    const existingRows = await query('SELECT CategoryID FROM mst_servicecategorydata WHERE ServiceID = ?', [ServiceID]);
    const existingCategoryIds = existingRows.map(r => r.CategoryID);
    const toDelete = existingCategoryIds.filter(id => !newCategoryIds.includes(id));
    const toInsert = newCategoryIds.filter(id => !existingCategoryIds.includes(id));
    if (toDelete.length) {
      await query(`DELETE FROM mst_servicecategorydata WHERE ServiceID = ? AND CategoryID IN (${toDelete.map(() => '?').join(',')})`, [ServiceID, ...toDelete]);
    }
    if (toInsert.length) {
      const insertData = toInsert.map(CategoryID => ({ ServiceID, CategoryID }));
      await bulkInsert('mst_servicecategorydata', insertData);
    }
    return NextResponse.json({ status: true, message: 'Categories synced successfully', added: toInsert, removed: toDelete, final: newCategoryIds });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Something went wrong', error: error.message }, { status: 500 });
  }
}
