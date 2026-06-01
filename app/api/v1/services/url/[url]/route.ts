import { NextResponse, type NextRequest } from 'next/server';
import { query, queryOne } from '@/lib/db';
import type { Service, ServiceFaq, Category } from '@/types/entities';
import type { RouteContext, UrlParams } from '@/types/api';

export async function GET(_request: NextRequest, context: RouteContext<UrlParams>) {
  try {
    const { url } = await context.params;
    const service = await queryOne<Service>('SELECT * FROM mst_servicedata WHERE ServiceNameURL = ? AND ActiveStatus = 1', [url]);
    if (!service) return NextResponse.json({ status: false, message: 'Service not found' }, { status: 404 });
    const faqs = await query<ServiceFaq>('SELECT * FROM mst_servicefaqdata WHERE ServiceID = ?', [service.ServiceID]);
    const categories = await query<Category>(
      `SELECT c.* FROM mst_categorydata c
       INNER JOIN mst_servicecategorydata sc ON c.CategoryID = sc.CategoryID
       WHERE sc.ServiceID = ?`, [service.ServiceID]
    );
    (service as any).faqs = faqs;
    (service as any).categories = categories;
    return NextResponse.json({ status: true, data: service });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching service by URL', error: (error as Error).message }, { status: 500 });
  }
}
