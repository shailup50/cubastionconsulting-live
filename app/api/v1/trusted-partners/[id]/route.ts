import { NextResponse, type NextRequest } from "next/server";
import { query, queryOne, update, remove } from "@/lib/db";
import type { Logo } from "@/types/entities";
import type { RouteContext, IdParams } from "@/types/api";

const TRUSTED_PARTNER_STATUS = 2;

async function getTrustedPartner(id: string) {
  return queryOne<Logo>(
    "SELECT * FROM mst_logodata WHERE LogoID = ? AND ActiveStatus = ?",
    [id, TRUSTED_PARTNER_STATUS],
  );
}

export async function GET(request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const partner = await getTrustedPartner(id);
    if (!partner) {
      return NextResponse.json({ status: false, message: "Trusted partner not found" }, { status: 404 });
    }
    return NextResponse.json({ status: true, data: partner });
  } catch (error: any) {
    return NextResponse.json(
      { status: false, message: "Error fetching trusted partner", error: error.message },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const partner = await getTrustedPartner(id);
    if (!partner) {
      return NextResponse.json({ status: false, message: "Trusted partner not found" }, { status: 404 });
    }

    const body = await request.json();
    if (body.LogoNameURL) {
      const existing = await query(
        "SELECT LogoID FROM mst_logodata WHERE LogoNameURL = ? AND ActiveStatus = ? AND LogoID != ?",
        [body.LogoNameURL, TRUSTED_PARTNER_STATUS, id],
      );
      if (existing.length) {
        return NextResponse.json(
          { status: false, message: "This trusted partner URL already exists" },
          { status: 422 },
        );
      }
    }

    const data: Record<string, unknown> = { ActiveStatus: TRUSTED_PARTNER_STATUS };
    ["LogoName", "LogoNameURL", "LogoImage1", "DisplayOrder"].forEach((field) => {
      if (body[field] !== undefined) data[field] = body[field];
    });
    data.UpdatedBy = body.UpdatedBy || "admin";

    await update("mst_logodata", data, "LogoID = ?", [id]);
    const updated = await getTrustedPartner(id);

    return NextResponse.json({
      status: true,
      message: "Trusted partner updated successfully",
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: false,
        message: "Something went wrong while updating trusted partner",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const partner = await getTrustedPartner(id);
    if (!partner) {
      return NextResponse.json({ status: false, message: "Trusted partner not found" }, { status: 404 });
    }

    await remove("mst_logodata", "LogoID = ? AND ActiveStatus = ?", [id, TRUSTED_PARTNER_STATUS]);

    return NextResponse.json({ status: true, message: "Trusted partner deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { status: false, message: "Failed to delete trusted partner", error: error.message },
      { status: 500 },
    );
  }
}
