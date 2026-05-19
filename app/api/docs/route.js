import { NextResponse } from "next/server";

/** Public docs removed — send clients to admin login. */
export async function GET(request) {
  return NextResponse.redirect(new URL("/cubastion-admin/login", request.url));
}
