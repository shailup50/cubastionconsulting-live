import { NextResponse } from "next/server";
import { query, insert } from "@/lib/db";

const TRUSTED_PARTNER_STATUS = 2;

export async function GET() {
  try {
    const partners = await query(
      "SELECT * FROM mst_logodata WHERE ActiveStatus = ? ORDER BY DisplayOrder ASC, LogoID DESC",
      [TRUSTED_PARTNER_STATUS],
    );
    return NextResponse.json({ status: true, data: partners });
  } catch (error) {
    return NextResponse.json(
      { status: false, message: "Failed to fetch trusted partners", error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { LogoName, LogoNameURL, LogoImage1, DisplayOrder } = body;

    if (!LogoName || !LogoNameURL || !LogoImage1 || DisplayOrder === undefined) {
      return NextResponse.json(
        {
          status: false,
          message: "LogoName, LogoNameURL, LogoImage1, and DisplayOrder are required",
        },
        { status: 422 },
      );
    }

    const existing = await query(
      "SELECT LogoID FROM mst_logodata WHERE LogoNameURL = ? AND ActiveStatus = ?",
      [LogoNameURL, TRUSTED_PARTNER_STATUS],
    );
    if (existing.length) {
      return NextResponse.json(
        { status: false, message: "This trusted partner URL already exists" },
        { status: 422 },
      );
    }

    const result = await insert("mst_logodata", {
      LogoName,
      LogoNameURL,
      LogoImage1,
      DisplayOrder,
      ActiveStatus: TRUSTED_PARTNER_STATUS,
    });

    const partner = await query("SELECT * FROM mst_logodata WHERE LogoID = ?", [
      result.insertId,
    ]);

    return NextResponse.json(
      { status: true, message: "Trusted partner created successfully", data: partner[0] },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        message: "Something went wrong while creating trusted partner",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
