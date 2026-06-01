import { NextResponse, type NextRequest } from "next/server";
import { queryOne, remove } from "@/lib/db";
import type { RouteContext, IdParams } from "@/types/api";

export async function GET(request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const application = await queryOne("SELECT * FROM mst_career WHERE CareerID = ?", [id]);
    if (!application) return NextResponse.json({ status: false, message: "Application not found" }, { status: 404 });
    return NextResponse.json({ status: true, data: application });
  } catch (error: any) {
    return NextResponse.json({ status: false, message: "Error fetching application", error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const application = await queryOne("SELECT * FROM mst_career WHERE CareerID = ?", [id]);
    if (!application) return NextResponse.json({ status: false, message: "Application not found" }, { status: 404 });
    await remove("mst_career", "CareerID = ?", [id]);
    return NextResponse.json({ status: true, message: "Application deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ status: false, message: "Error deleting application", error: error.message }, { status: 500 });
  }
}
