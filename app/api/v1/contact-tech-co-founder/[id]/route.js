import { NextResponse } from "next/server";
import { queryOne, remove } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const row = await queryOne("SELECT * FROM contact_tech_co_founder WHERE id = ?", [id]);
    if (!row) {
      return NextResponse.json({ status: false, message: "Enquiry not found" }, { status: 404 });
    }
    return NextResponse.json({ status: true, data: row });
  } catch (error) {
    return NextResponse.json(
      { status: false, message: "Error fetching enquiry", error: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const row = await queryOne("SELECT * FROM contact_tech_co_founder WHERE id = ?", [id]);
    if (!row) {
      return NextResponse.json({ status: false, message: "Enquiry not found" }, { status: 404 });
    }
    await remove("contact_tech_co_founder", "id = ?", [id]);
    return NextResponse.json({ status: true, message: "Enquiry deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { status: false, message: "Failed to delete enquiry", error: error.message },
      { status: 500 },
    );
  }
}
