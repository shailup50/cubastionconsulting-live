import { NextResponse, type NextRequest } from "next/server";
import { query, queryOne, update, remove } from "@/lib/db";
import type { ServiceCategory } from "@/types/entities";
import type { RouteContext, IdParams } from "@/types/api";

export async function GET(request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const data = await queryOne(
      `SELECT sc.*, s.ServiceName, c.CategoryName FROM mst_servicecategorydata sc
       LEFT JOIN mst_servicedata s ON sc.ServiceID = s.ServiceID
       LEFT JOIN mst_categorydata c ON sc.CategoryID = c.CategoryID
       WHERE sc.ServiceCategoryID = ?`, [id]
    );
    if (!data) return NextResponse.json({ status: false, message: "Requested service-category mapping not found" }, { status: 404 });
    return NextResponse.json({ status: true, data });
  } catch (error: any) {
    return NextResponse.json({ status: false, message: "Error fetching service category", error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const data: any = await queryOne("SELECT * FROM mst_servicecategorydata WHERE ServiceCategoryID = ?", [id]);
    if (!data) return NextResponse.json({ status: false, message: "Requested service-category mapping not found" }, { status: 404 });
    const body = await request.json();
    const serviceId = body.ServiceID || data.ServiceID;
    const categoryId = body.CategoryID || data.CategoryID;
    const exists = await query("SELECT ServiceCategoryID FROM mst_servicecategorydata WHERE ServiceID = ? AND CategoryID = ? AND ServiceCategoryID != ?", [serviceId, categoryId, id]);
    if (exists.length) return NextResponse.json({ status: false, message: "This service is already linked with the selected category" }, { status: 409 });
    const updateData: Record<string, unknown> = {};
    if (body.ServiceID !== undefined) updateData.ServiceID = body.ServiceID;
    if (body.CategoryID !== undefined) updateData.CategoryID = body.CategoryID;
    await update("mst_servicecategorydata", updateData, "ServiceCategoryID = ?", [id]);
    const updated = await queryOne(
      `SELECT sc.*, s.ServiceName, c.CategoryName FROM mst_servicecategorydata sc
       LEFT JOIN mst_servicedata s ON sc.ServiceID = s.ServiceID
       LEFT JOIN mst_categorydata c ON sc.CategoryID = c.CategoryID
       WHERE sc.ServiceCategoryID = ?`, [id]
    );
    return NextResponse.json({ status: true, message: "Service category updated successfully", data: updated });
  } catch (error: any) {
    return NextResponse.json({ status: false, message: "Error updating service category", error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const data = await queryOne("SELECT * FROM mst_servicecategorydata WHERE ServiceCategoryID = ?", [id]);
    if (!data) return NextResponse.json({ status: false, message: "Requested service-category mapping not found" }, { status: 404 });
    await remove("mst_servicecategorydata", "ServiceCategoryID = ?", [id]);
    return NextResponse.json({ status: true, message: "Service category removed successfully" });
  } catch (error: any) {
    return NextResponse.json({ status: false, message: "Error deleting service category", error: error.message }, { status: 500 });
  }
}
