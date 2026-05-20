import { NextResponse } from "next/server";
import { query, queryOne, update, remove } from "@/lib/db";

const TRUSTED_PARTNER_STATUS = 2;

async function getTrustedPartner(id) {
  return queryOne(
    "SELECT * FROM mst_logodata WHERE LogoID = ? AND ActiveStatus = ?",
    [id, TRUSTED_PARTNER_STATUS],
  );
}

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const partner = await getTrustedPartner(id);
    if (!partner) {
      return NextResponse.json({ status: false, message: "Trusted partner not found" }, { status: 404 });
    }
    return NextResponse.json({ status: true, data: partner });
  } catch (error) {
    return NextResponse.json(
      { status: false, message: "Error fetching trusted partner", error: error.message },
      { status: 500 },
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const partner = await getTrustedPartner(id);
    if (!partner) {
      return NextResponse.json({ status: false, message: "Trusted partner not found" }, { status: 404 });
    }

    const body = await req.json();
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

    const data = { ActiveStatus: TRUSTED_PARTNER_STATUS };
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
  } catch (error) {
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

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const partner = await getTrustedPartner(id);
    if (!partner) {
      return NextResponse.json({ status: false, message: "Trusted partner not found" }, { status: 404 });
    }

    await remove("mst_logodata", "LogoID = ? AND ActiveStatus = ?", [id, TRUSTED_PARTNER_STATUS]);

    return NextResponse.json({ status: true, message: "Trusted partner deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { status: false, message: "Failed to delete trusted partner", error: error.message },
      { status: 500 },
    );
  }
}
