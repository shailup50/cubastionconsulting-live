import { NextResponse, type NextRequest } from "next/server";
import { query, remove, bulkInsert } from "@/lib/db";
import type { IndustrySolution } from "@/types/entities";

export async function GET() {
  try {
    const solutions = await query<IndustrySolution & { IndustryName?: string }>(
      `SELECT s.*, i.IndustryName FROM mst_industrysolutiondata s
       LEFT JOIN mst_industrydata i ON s.IndustryID = i.IndustryID`
    );
    return NextResponse.json({ status: true, data: solutions });
  } catch (error: any) {
    return NextResponse.json({ status: false, message: "Failed to fetch solutions", error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { IndustryID, Solutions } = body;
    if (!IndustryID) return NextResponse.json({ status: false, message: "IndustryID is required" }, { status: 422 });
    await remove("mst_industrysolutiondata", "IndustryID = ?", [IndustryID]);
    const solutions: Array<{ IndustrySolutionHeading?: string; IndustrySolutionTagline?: string; IndustrySolutionImage?: string }> = Solutions || [];
    const insertData = solutions.filter(s => (s.IndustrySolutionHeading || "").trim() || (s.IndustrySolutionTagline || "").trim() || (s.IndustrySolutionImage || "").trim())
      .map(s => ({ IndustryID, IndustrySolutionHeading: s.IndustrySolutionHeading, IndustrySolutionTagline: s.IndustrySolutionTagline, IndustrySolutionImage: s.IndustrySolutionImage }));
    if (!insertData.length) return NextResponse.json({ status: true, message: "Old solutions deleted. No valid solutions to insert." });
    await bulkInsert("mst_industrysolutiondata", insertData);
    return NextResponse.json({ status: true, message: "Solutions deleted and added successfully" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ status: false, message: "Something went wrong", error: error.message }, { status: 500 });
  }
}
