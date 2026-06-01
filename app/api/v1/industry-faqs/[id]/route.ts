import { NextResponse, type NextRequest } from "next/server";
import { queryOne, update } from "@/lib/db";
import type { IndustryFaq } from "@/types/entities";
import type { RouteContext, IdParams } from "@/types/api";

export async function GET(request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const faq = await queryOne<IndustryFaq>("SELECT * FROM mst_industryfaqdata WHERE IndustryFaqID = ?", [id]);
    if (!faq) return NextResponse.json({ status: false, message: "FAQ not found" }, { status: 404 });
    return NextResponse.json({ status: true, data: faq });
  } catch (error: any) {
    return NextResponse.json({ status: false, message: "Error fetching FAQ", error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const faq = await queryOne<IndustryFaq>("SELECT * FROM mst_industryfaqdata WHERE IndustryFaqID = ?", [id]);
    if (!faq) return NextResponse.json({ status: false, message: "FAQ not found" }, { status: 404 });
    const body = await request.json();
    const data: Record<string, unknown> = {};
    ["IndustryID", "Question", "Answer"].forEach(f => { if (body[f] !== undefined) data[f] = body[f]; });
    await update("mst_industryfaqdata", data, "IndustryFaqID = ?", [id]);
    const updated = await queryOne<IndustryFaq>("SELECT * FROM mst_industryfaqdata WHERE IndustryFaqID = ?", [id]);
    return NextResponse.json({ status: true, message: "Industry FAQ updated successfully", data: updated });
  } catch (error: any) {
    return NextResponse.json({ status: false, message: "Something went wrong", error: error.message }, { status: 500 });
  }
}
