import { NextResponse, type NextRequest } from "next/server";
import { queryOne, update, remove } from "@/lib/db";
import type { PortfolioHighlight } from "@/types/entities";
import type { RouteContext, IdParams } from "@/types/api";

export async function GET(request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const highlight = await queryOne<PortfolioHighlight>("SELECT * FROM mst_portfoliohighlightdata WHERE PortfolioHighlightID = ?", [id]);
    if (!highlight) return NextResponse.json({ status: false, message: "Highlight not found" }, { status: 404 });
    return NextResponse.json({ status: true, data: highlight });
  } catch (error: any) {
    return NextResponse.json({ status: false, message: "Error fetching highlight", error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const highlight = await queryOne<PortfolioHighlight>("SELECT * FROM mst_portfoliohighlightdata WHERE PortfolioHighlightID = ?", [id]);
    if (!highlight) return NextResponse.json({ status: false, message: "Highlight not found" }, { status: 404 });
    const body = await request.json();
    const data: Record<string, unknown> = {};
    ["PortfolioID", "Question"].forEach(f => { if (body[f] !== undefined) data[f] = body[f]; });
    await update("mst_portfoliohighlightdata", data, "PortfolioHighlightID = ?", [id]);
    const updated = await queryOne<PortfolioHighlight>("SELECT * FROM mst_portfoliohighlightdata WHERE PortfolioHighlightID = ?", [id]);
    return NextResponse.json({ status: true, message: "Highlight updated successfully", data: updated });
  } catch (error: any) {
    return NextResponse.json({ status: false, message: "Error updating highlight", error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const highlight = await queryOne<PortfolioHighlight>("SELECT * FROM mst_portfoliohighlightdata WHERE PortfolioHighlightID = ?", [id]);
    if (!highlight) return NextResponse.json({ status: false, message: "Highlight not found" }, { status: 404 });
    await remove("mst_portfoliohighlightdata", "PortfolioHighlightID = ?", [id]);
    return NextResponse.json({ status: true, message: "Highlight deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ status: false, message: "Error deleting highlight", error: error.message }, { status: 500 });
  }
}
