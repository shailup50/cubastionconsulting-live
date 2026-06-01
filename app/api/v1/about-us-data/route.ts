import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const teams = await query("SELECT TeamName, TeamDesignation, TeamBio, TeamImage, TeamLinkedInLink FROM mst_teamdata WHERE ActiveStatus = 1 ORDER BY DisplayOrder ASC");
    const milestones = await query("SELECT MilestoneYear, Title, Description FROM mst_milestonedata WHERE ActiveStatus = 1 ORDER BY DisplayOrder ASC");
    return NextResponse.json({ status: true, data: { teams, milestones } });
  } catch (error: any) {
    return NextResponse.json({ status: false, message: "Failed to fetch about data", error: error.message }, { status: 500 });
  }
}
