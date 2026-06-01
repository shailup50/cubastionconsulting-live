import { NextResponse, type NextRequest } from "next/server";
import { query, insert } from "@/lib/db";
import type { ContactUs } from "@/types/entities";

export async function GET() {
  try {
    const contacts = await query<ContactUs>("SELECT * FROM mst_contact_us ORDER BY ContactID DESC");
    return NextResponse.json({ status: true, data: contacts });
  } catch (error: any) {
    return NextResponse.json({ status: false, message: "Failed to fetch enquiries", error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { FullName, EmailID } = body;
    if (!FullName || !EmailID) {
      return NextResponse.json({ status: false, message: "Full name and email are required" }, { status: 422 });
    }
    const data: Record<string, unknown> = {};
    ["FullName", "EmailID", "PhoneNo", "NoOfGuest", "Message", "EnquiryType", "EnquiryFor", "PageName"].forEach(f => { if (body[f] !== undefined) data[f] = body[f]; });
    const result = await insert("mst_contact_us", data);
    const contact = await query<ContactUs>("SELECT * FROM mst_contact_us WHERE ContactID = ?", [result.insertId]);
    return NextResponse.json({ status: true, message: "Enquiry submitted successfully", data: contact[0] }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ status: false, message: "Something went wrong while submitting enquiry", error: error.message }, { status: 500 });
  }
}
