import { NextResponse, type NextRequest } from "next/server";
import { queryOne, remove } from "@/lib/db";
import type { ContactSiebelExpert } from "@/types/entities";
import type { RouteContext, IdParams } from "@/types/api";

export async function GET(request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const row = await queryOne<ContactSiebelExpert>("SELECT * FROM contact_siebel_expert WHERE id = ?", [id]);
    if (!row) {
      return NextResponse.json({ status: false, message: "Enquiry not found" }, { status: 404 });
    }
    return NextResponse.json({ status: true, data: row });
  } catch (error: any) {
    return NextResponse.json(
      { status: false, message: "Error fetching enquiry", error: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const row = await queryOne<ContactSiebelExpert>("SELECT * FROM contact_siebel_expert WHERE id = ?", [id]);
    if (!row) {
      return NextResponse.json({ status: false, message: "Enquiry not found" }, { status: 404 });
    }
    await remove("contact_siebel_expert", "id = ?", [id]);
    return NextResponse.json({ status: true, message: "Enquiry deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { status: false, message: "Failed to delete enquiry", error: error.message },
      { status: 500 },
    );
  }
}
