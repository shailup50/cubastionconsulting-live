import { NextResponse, type NextRequest } from "next/server";
import { query } from "@/lib/db";
import type { ServiceFaq } from "@/types/entities";
import type { RouteContext } from "@/types/api";

export async function GET(request: NextRequest, context: RouteContext<{ serviceId: string }>) {
  try {
    const { serviceId } = await context.params;
    const faqs = await query<ServiceFaq>("SELECT * FROM mst_servicefaqdata WHERE ServiceID = ?", [serviceId]);
    return NextResponse.json({ status: true, data: faqs });
  } catch (error: any) {
    return NextResponse.json({ status: false, message: "Error fetching service FAQs", error: error.message }, { status: 500 });
  }
}
