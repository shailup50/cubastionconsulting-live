import { NextResponse, type NextRequest } from "next/server";
import { query, remove, bulkInsert } from "@/lib/db";
import type { IndustryFaq } from "@/types/entities";

export async function GET() {
  try {
    const faqs = await query<IndustryFaq & { IndustryName?: string }>(
      `SELECT f.*, i.IndustryName FROM mst_industryfaqdata f
       LEFT JOIN mst_industrydata i ON f.IndustryID = i.IndustryID`
    );
    return NextResponse.json({ status: true, data: faqs });
  } catch (error: any) {
    return NextResponse.json({ status: false, message: "Failed to fetch FAQs", error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { IndustryID, FAQs } = body;
    if (!IndustryID) return NextResponse.json({ status: false, message: "IndustryID is required" }, { status: 422 });
    await remove("mst_industryfaqdata", "IndustryID = ?", [IndustryID]);
    const faqs: Array<{ Question?: string; Answer?: string }> = FAQs || [];
    const insertData = faqs.filter(f => (f.Question || "").trim() || (f.Answer || "").trim()).map(f => ({ IndustryID, Question: f.Question, Answer: f.Answer }));
    if (!insertData.length) return NextResponse.json({ status: true, message: "Old FAQs deleted. No valid FAQs to insert." });
    await bulkInsert("mst_industryfaqdata", insertData);
    return NextResponse.json({ status: true, message: "FAQs deleted and added successfully" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ status: false, message: "Something went wrong", error: error.message }, { status: 500 });
  }
}
