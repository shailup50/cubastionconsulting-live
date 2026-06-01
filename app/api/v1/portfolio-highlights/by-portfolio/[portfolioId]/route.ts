import { NextResponse, type NextRequest } from "next/server";
import { query } from "@/lib/db";
import type { PortfolioHighlight } from "@/types/entities";
import type { RouteContext } from "@/types/api";

export async function GET(request: NextRequest, context: RouteContext<{ portfolioId: string }>) {
  try {
    const { portfolioId } = await context.params;
    const highlights = await query<PortfolioHighlight>("SELECT * FROM mst_portfoliohighlightdata WHERE PortfolioID = ?", [portfolioId]);
    return NextResponse.json({ status: true, data: highlights });
  } catch (error: any) {
    return NextResponse.json({ status: false, message: "Error fetching highlights", error: error.message }, { status: 500 });
  }
}
