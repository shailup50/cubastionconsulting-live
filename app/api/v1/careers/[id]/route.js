import { NextResponse } from "next/server";
import { query, queryOne, update, remove } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const career = await queryOne(
      "SELECT * FROM mst_careerdata WHERE CareerID = ?",
      [id],
    );
    if (!career)
      return NextResponse.json(
        { status: false, message: "Career not found" },
        { status: 404 },
      );
    return NextResponse.json({ status: true, data: career });
  } catch (error) {
    return NextResponse.json(
      { status: false, message: "Error fetching career", error: error.message },
      { status: 500 },
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const career = await queryOne(
      "SELECT * FROM mst_careerdata WHERE CareerID = ?",
      [id],
    );
    if (!career)
      return NextResponse.json(
        { status: false, message: "Career not found" },
        { status: 404 },
      );
    const body = await req.json();
    if (body.CareerNameURL) {
      const existing = await query(
        "SELECT CareerID FROM mst_careerdata WHERE CareerNameURL = ? AND CareerID != ?",
        [body.CareerNameURL, id],
      );
      if (existing.length)
        return NextResponse.json(
          { status: false, message: "This career URL already exists" },
          { status: 422 },
        );
    }
    const data = { ...body };
    delete data.CareerID;
    data.UpdatedBy = body.UpdatedBy || "Admin";
    data.UpdatedOn = new Date().toISOString().slice(0, 19).replace("T", " ");
    await update("mst_careerdata", data, "CareerID = ?", [id]);
    const updated = await queryOne(
      "SELECT * FROM mst_careerdata WHERE CareerID = ?",
      [id],
    );
    return NextResponse.json({
      status: true,
      message: "Career updated successfully",
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { status: false, message: "Error updating career", error: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const career = await queryOne(
      "SELECT * FROM mst_careerdata WHERE CareerID = ?",
      [id],
    );
    if (!career)
      return NextResponse.json(
        { status: false, message: "Career not found" },
        { status: 404 },
      );
    await remove("mst_careerdata", "CareerID = ?", [id]);
    return NextResponse.json({
      status: true,
      message: "Career deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { status: false, message: "Error deleting career", error: error.message },
      { status: 500 },
    );
  }
}
