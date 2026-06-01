import { NextResponse, type NextRequest } from "next/server";
import { query, insert } from "@/lib/db";
import type { Logo } from "@/types/entities";
import type { ApiSuccessResponse, ApiErrorResponse } from "@/types/api";

const TRUSTED_PARTNER_STATUS = 2;

export async function GET() {
  try {
    const partners = await query<Logo>(
      "SELECT * FROM mst_logodata WHERE ActiveStatus = ? ORDER BY DisplayOrder ASC, LogoID DESC",
      [TRUSTED_PARTNER_STATUS],
    );
    return NextResponse.json({ status: true, data: partners } satisfies ApiSuccessResponse<Logo[]>);
  } catch (error: any) {
    return NextResponse.json(
      { status: false, message: "Failed to fetch trusted partners", error: error.message } satisfies ApiErrorResponse,
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { LogoName, LogoNameURL, LogoImage1, DisplayOrder } = body;

    if (!LogoName || !LogoNameURL || !LogoImage1 || DisplayOrder === undefined) {
      return NextResponse.json(
        {
          status: false,
          message: "LogoName, LogoNameURL, LogoImage1, and DisplayOrder are required",
        } satisfies ApiErrorResponse,
        { status: 422 },
      );
    }

    const existing = await query(
      "SELECT LogoID FROM mst_logodata WHERE LogoNameURL = ? AND ActiveStatus = ?",
      [LogoNameURL, TRUSTED_PARTNER_STATUS],
    );
    if (existing.length) {
      return NextResponse.json(
        { status: false, message: "This trusted partner URL already exists" } satisfies ApiErrorResponse,
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

    const partner = await query<Logo>("SELECT * FROM mst_logodata WHERE LogoID = ?", [
      result.insertId,
    ]);

    return NextResponse.json(
      { status: true, message: "Trusted partner created successfully", data: partner[0] } satisfies ApiSuccessResponse<Logo>,
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: false,
        message: "Something went wrong while creating trusted partner",
        error: error.message,
      } satisfies ApiErrorResponse,
      { status: 500 },
    );
  }
}
