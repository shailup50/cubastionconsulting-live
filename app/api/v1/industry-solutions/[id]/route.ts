import { NextResponse, type NextRequest } from "next/server";
import { query, queryOne, update } from "@/lib/db";
import type { IndustrySolution } from "@/types/entities";
import type { RouteContext, IdParams } from "@/types/api";

export async function GET(request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const solution = await queryOne<IndustrySolution & { IndustryName?: string }>(
      `SELECT s.*, i.IndustryName FROM mst_industrysolutiondata s
       LEFT JOIN mst_industrydata i ON s.IndustryID = i.IndustryID
       WHERE s.IndustrySolutionID = ?`, [id]
    );
    if (!solution) return NextResponse.json({ status: false, message: "Solution not found" }, { status: 404 });
    return NextResponse.json({ status: true, data: solution });
  } catch (error: any) {
    return NextResponse.json({ status: false, message: "Error fetching solution", error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const solution = await queryOne<IndustrySolution>("SELECT * FROM mst_industrysolutiondata WHERE IndustrySolutionID = ?", [id]);
    if (!solution) return NextResponse.json({ status: false, message: "Solution not found" }, { status: 404 });
    const body = await request.json();
    const data: Record<string, unknown> = {};
    ["IndustryID", "IndustrySolutionHeading", "IndustrySolutionTagline", "IndustrySolutionImage"].forEach(f => { if (body[f] !== undefined) data[f] = body[f]; });
    await update("mst_industrysolutiondata", data, "IndustrySolutionID = ?", [id]);
    const updated = await queryOne<IndustrySolution>("SELECT * FROM mst_industrysolutiondata WHERE IndustrySolutionID = ?", [id]);
    return NextResponse.json({ status: true, message: "Solution updated successfully", data: updated });
  } catch (error: any) {
    return NextResponse.json({ status: false, message: "Something went wrong", error: error.message }, { status: 500 });
  }
}
