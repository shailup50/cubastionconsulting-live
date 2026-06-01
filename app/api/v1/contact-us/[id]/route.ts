import { NextResponse, type NextRequest } from "next/server";
import { queryOne, remove } from "@/lib/db";
import type { ContactUs } from "@/types/entities";
import type { RouteContext, IdParams } from "@/types/api";

export async function GET(request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const contact = await queryOne<ContactUs>("SELECT * FROM mst_contact_us WHERE ContactID = ?", [id]);
    if (!contact) return NextResponse.json({ status: false, message: "Enquiry not found" }, { status: 404 });
    return NextResponse.json({ status: true, data: contact });
  } catch (error: any) {
    return NextResponse.json({ status: false, message: "Error fetching enquiry", error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const contact = await queryOne<ContactUs>("SELECT * FROM mst_contact_us WHERE ContactID = ?", [id]);
    if (!contact) return NextResponse.json({ status: false, message: "Enquiry not found" }, { status: 404 });
    await remove("mst_contact_us", "ContactID = ?", [id]);
    return NextResponse.json({ status: true, message: "Enquiry deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ status: false, message: "Failed to delete enquiry", error: error.message }, { status: 500 });
  }
}
