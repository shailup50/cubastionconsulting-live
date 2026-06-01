import { NextResponse, type NextRequest } from "next/server";
import { queryOne, update, remove } from "@/lib/db";
import type { ServiceFaq } from "@/types/entities";
import type { RouteContext, IdParams } from "@/types/api";

export async function GET(request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const faq = await queryOne<ServiceFaq>("SELECT * FROM mst_servicefaqdata WHERE ServiceFaqID = ?", [id]);
    if (!faq) return NextResponse.json({ status: false, message: "FAQ not found" }, { status: 404 });
    return NextResponse.json({ status: true, data: faq });
  } catch (error: any) {
    return NextResponse.json({ status: false, message: "Error fetching FAQ", error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const faq = await queryOne<ServiceFaq>("SELECT * FROM mst_servicefaqdata WHERE ServiceFaqID = ?", [id]);
    if (!faq) return NextResponse.json({ status: false, message: "FAQ not found" }, { status: 404 });
    const body = await request.json();
    const data: Record<string, unknown> = {};
    ["ServiceID", "Question", "Answer"].forEach(f => { if (body[f] !== undefined) data[f] = body[f]; });
    await update("mst_servicefaqdata", data, "ServiceFaqID = ?", [id]);
    const updated = await queryOne<ServiceFaq>("SELECT * FROM mst_servicefaqdata WHERE ServiceFaqID = ?", [id]);
    return NextResponse.json({ status: true, message: "Service FAQ updated successfully", data: updated });
  } catch (error: any) {
    return NextResponse.json({ status: false, message: "Error updating FAQ", error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const faq = await queryOne<ServiceFaq>("SELECT * FROM mst_servicefaqdata WHERE ServiceFaqID = ?", [id]);
    if (!faq) return NextResponse.json({ status: false, message: "FAQ not found" }, { status: 404 });
    await remove("mst_servicefaqdata", "ServiceFaqID = ?", [id]);
    return NextResponse.json({ status: true, message: "Service FAQ deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ status: false, message: "Error deleting FAQ", error: error.message }, { status: 500 });
  }
}
