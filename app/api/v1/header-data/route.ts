import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const industries: any[] = await query("SELECT IndustryID, IndustryName, IndustryNameURL FROM mst_industrydata WHERE ActiveStatus = 1 ORDER BY DisplayOrder ASC");
    for (const ind of industries) {
      ind.solutions = await query("SELECT * FROM mst_industrysolutiondata WHERE IndustryID = ?", [ind.IndustryID]);
    }
    const service = await query("SELECT ServiceName FROM mst_servicedata WHERE ActiveStatus = 1 ORDER BY DisplayOrder ASC");
    const logos = await query("SELECT LogoName, LogoNameURL, LogoImage1 FROM mst_logodata WHERE ActiveStatus = 1 ORDER BY DisplayOrder ASC");
    return NextResponse.json({ status: true, data: { industries, service, logos } });
  } catch (error: any) {
    return NextResponse.json({ status: false, message: "Failed to fetch header data", error: error.message }, { status: 500 });
  }
}
