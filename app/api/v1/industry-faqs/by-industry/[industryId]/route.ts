import { NextResponse, type NextRequest } from "next/server";
import { query, remove } from "@/lib/db";
import type { IndustryFaq } from "@/types/entities";
import type { RouteContext } from "@/types/api";

export async function GET(request: NextRequest, context: RouteContext<{ industryId: string }>) {
  try {
    const { industryId } = await context.params;
    const faqs = await query<IndustryFaq>("SELECT * FROM mst_industryfaqdata WHERE IndustryID = ?", [industryId]);
    return NextResponse.json({ status: true, data: faqs });
  } catch (error: any) {
    return NextResponse.json({ status: false, message: "Failed to fetch FAQs by industry", error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext<{ industryId: string }>) {
  try {
    const { industryId } = await context.params;
    const faqs = await query<IndustryFaq>("SELECT * FROM mst_industryfaqdata WHERE IndustryID = ?", [industryId]);
    if (!faqs.length) return NextResponse.json({ status: false, message: "No FAQs found for this Industry" }, { status: 404 });
    await remove("mst_industryfaqdata", "IndustryID = ?", [industryId]);
    return NextResponse.json({ status: true, message: "All FAQs deleted successfully for this Industry" });
  } catch (error: any) {
    return NextResponse.json({ status: false, message: "Failed to delete FAQs", error: error.message }, { status: 500 });
  }
}
