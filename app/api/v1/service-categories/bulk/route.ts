import { NextResponse, type NextRequest } from "next/server";
import { query, bulkInsert } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ServiceID, CategoryIDs } = body;
    if (!ServiceID || !CategoryIDs || !CategoryIDs.length) {
      return NextResponse.json({ status: false, message: "ServiceID and at least one CategoryID are required" }, { status: 422 });
    }
    const newCategoryIds: number[] = [...new Set(CategoryIDs.filter(Boolean) as number[])];
    const existingRows: any[] = await query("SELECT CategoryID FROM mst_servicecategorydata WHERE ServiceID = ?", [ServiceID]);
    const existingCategoryIds: number[] = existingRows.map(r => r.CategoryID);
    const toDelete = existingCategoryIds.filter(id => !newCategoryIds.includes(id));
    const toInsert = newCategoryIds.filter(id => !existingCategoryIds.includes(id));
    if (toDelete.length) {
      await query(`DELETE FROM mst_servicecategorydata WHERE ServiceID = ? AND CategoryID IN (${toDelete.map(() => "?").join(",")})`, [ServiceID, ...toDelete]);
    }
    if (toInsert.length) {
      const insertData = toInsert.map(CategoryID => ({ ServiceID, CategoryID }));
      await bulkInsert("mst_servicecategorydata", insertData);
    }
    return NextResponse.json({ status: true, message: "Categories synced successfully", added: toInsert, removed: toDelete, final: newCategoryIds });
  } catch (error: any) {
    return NextResponse.json({ status: false, message: "Something went wrong", error: error.message }, { status: 500 });
  }
}
