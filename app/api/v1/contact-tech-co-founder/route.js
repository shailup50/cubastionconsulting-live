import { NextResponse } from "next/server";
import { query, insert } from "@/lib/db";

function mapBodyToRow(body) {
  return {
    name: body.name ?? "",
    email: body.email ?? body.EmailID ?? "",
    idea_description: body.idea_description ?? body.ideaDescription ?? body.idea ?? "",
  };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

export async function GET() {
  try {
    const rows = await query(
      "SELECT * FROM contact_tech_co_founder ORDER BY id DESC",
    );
    return NextResponse.json({ status: true, data: rows });
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        message: "Failed to fetch tech co-founder enquiries",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const row = mapBodyToRow(body);

    if (!row.name?.trim()) {
      return NextResponse.json(
        { status: false, message: "Name is required" },
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
    if (!row.idea_description?.trim()) {
      return NextResponse.json(
        { status: false, message: "Idea description is required" },
        { status: 422 },
      );
    }
    if (row.idea_description.trim().length < 10) {
      return NextResponse.json(
        { status: false, message: "Please provide at least 10 characters describing your idea" },
        { status: 422 },
      );
    }

    const data = {
      name: row.name.trim(),
      email: row.email.trim(),
      idea_description: row.idea_description.trim(),
    };

    const result = await insert("contact_tech_co_founder", data);
    const created = await query("SELECT * FROM contact_tech_co_founder WHERE id = ?", [
      result.insertId,
    ]);

    return NextResponse.json(
      {
        status: true,
        message: "Your idea has been submitted successfully",
        data: created[0],
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        message: "Something went wrong while submitting your idea",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
