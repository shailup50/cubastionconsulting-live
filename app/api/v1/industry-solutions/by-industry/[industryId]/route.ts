import { NextResponse, type NextRequest } from "next/server";
import { query, remove } from "@/lib/db";
import type { IndustrySolution } from "@/types/entities";
import type { RouteContext } from "@/types/api";

export async function GET(request: NextRequest, context: RouteContext<{ industryId: string }>) {
  try {
    const { industryId } = await context.params;
    const solutions = await query<IndustrySolution>("SELECT * FROM mst_industrysolutiondata WHERE IndustryID = ?", [industryId]);
    return NextResponse.json({ status: true, data: solutions });
  } catch (error: any) {
    return NextResponse.json({ status: false, message: "Failed to fetch solutions by industry", error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext<{ industryId: string }>) {
  try {
    const { industryId } = await context.params;
    const solutions = await query<IndustrySolution>("SELECT * FROM mst_industrysolutiondata WHERE IndustryID = ?", [industryId]);
    if (!solutions.length) return NextResponse.json({ status: false, message: "No solutions found for this Industry" }, { status: 404 });
    await remove("mst_industrysolutiondata", "IndustryID = ?", [industryId]);
    return NextResponse.json({ status: true, message: "All Solutions deleted successfully for this Industry" });
  } catch (error: any) {
    return NextResponse.json({ status: false, message: "Failed to delete Solutions", error: error.message }, { status: 500 });
  }
}
