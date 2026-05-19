import { NextResponse } from "next/server";
import { getOpenApiSpec } from "@/lib/swagger/spec";
import { verifyAdminToken } from "@/lib/auth/verify-admin-token";

export async function GET(request) {
  const user = await verifyAdminToken(request.headers.get("authorization"));

  if (!user) {
    return NextResponse.json(
      { status: false, message: "Unauthorized. Admin login required." },
      { status: 401 },
    );
  }

  const spec = getOpenApiSpec();
  return NextResponse.json(spec, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
