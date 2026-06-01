import { NextResponse, type NextRequest } from "next/server";
import { query, insert } from "@/lib/db";
import type { ContactSiebelExpert } from "@/types/entities";

interface SiebelExpertBody {
  first_name?: string;
  firstName?: string;
  last_name?: string;
  lastName?: string;
  email?: string;
  EmailID?: string;
  company?: string;
  service?: string;
  version?: string;
}

function mapBodyToRow(body: SiebelExpertBody) {
  return {
    first_name: body.first_name ?? body.firstName ?? "",
    last_name: body.last_name ?? body.lastName ?? null,
    email: body.email ?? body.EmailID ?? "",
    company: body.company ?? null,
    service: body.service ?? null,
    version: body.version ?? null,
  };
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

export async function GET() {
  try {
    const rows = await query<ContactSiebelExpert>(
      "SELECT * FROM contact_siebel_expert ORDER BY id DESC",
    );
    return NextResponse.json({ status: true, data: rows });
  } catch (error: any) {
    return NextResponse.json(
      { status: false, message: "Failed to fetch Siebel expert enquiries", error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: SiebelExpertBody = await request.json();
    const row = mapBodyToRow(body);

    if (!row.first_name?.trim()) {
      return NextResponse.json(
        { status: false, message: "First name is required" },
        { status: 422 },
      );
    }
    if (!row.email?.trim()) {
      return NextResponse.json(
        { status: false, message: "Email is required" },
        { status: 422 },
      );
    }
    if (!isValidEmail(row.email)) {
      return NextResponse.json(
        { status: false, message: "Please provide a valid email address" },
        { status: 422 },
      );
    }

    const data = {
      first_name: row.first_name.trim(),
      last_name: row.last_name?.trim() || null,
      email: row.email.trim(),
      company: row.company?.trim() || null,
      service: row.service?.trim() || null,
      version: row.version?.trim() || null,
    };

    const result = await insert("contact_siebel_expert", data);
    const created = await query<ContactSiebelExpert>("SELECT * FROM contact_siebel_expert WHERE id = ?", [
      result.insertId,
    ]);

    return NextResponse.json(
      {
        status: true,
        message: "Siebel expert enquiry submitted successfully",
        data: created[0],
      },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: false,
        message: "Something went wrong while submitting enquiry",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
