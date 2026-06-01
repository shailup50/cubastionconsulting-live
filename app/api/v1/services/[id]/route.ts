import { NextResponse, type NextRequest } from 'next/server';
import { query, queryOne, update, remove } from '@/lib/db';
import type { Service, ServiceFaq, Category } from '@/types/entities';
import type { RouteContext, IdParams } from '@/types/api';

export async function GET(_request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const service = await queryOne<Service>('SELECT * FROM mst_servicedata WHERE ServiceID = ?', [id]);
    if (!service) return NextResponse.json({ status: false, message: 'Service not found' }, { status: 404 });
    const faqs = await query<ServiceFaq>('SELECT * FROM mst_servicefaqdata WHERE ServiceID = ?', [id]);
    const categories = await query<Category>(
      `SELECT c.* FROM mst_categorydata c
       INNER JOIN mst_servicecategorydata sc ON c.CategoryID = sc.CategoryID
       WHERE sc.ServiceID = ?`, [id]
    );
    (service as any).faqs = faqs;
    (service as any).categories = categories;
    return NextResponse.json({ status: true, data: service });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching service', error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const service = await queryOne<Service>('SELECT * FROM mst_servicedata WHERE ServiceID = ?', [id]);
    if (!service) return NextResponse.json({ status: false, message: 'Service not found' }, { status: 404 });
    const body = await request.json();
    if (body.ServiceNameURL) {
      const existing = await query('SELECT ServiceID FROM mst_servicedata WHERE ServiceNameURL = ? AND ServiceID != ?', [body.ServiceNameURL, id]);
      if (existing.length) return NextResponse.json({ status: false, message: 'This service URL already exists' }, { status: 422 });
    }
    const data: Record<string, unknown> = {};
    ['ServiceName','ServiceNameURL','ServiceImage','ServiceBannerImage','ServiceBannerImage1','ServiceTagLine','ServicePunchline','DescriptionHeading','Description','OtherDescriptionHeading','OtherDescription','DisplayOrder','ActiveStatus','MetaTitle','MetaKeywords','MetaDescriptions','MetaSchema','MetaOgImage'].forEach(f => { if (body[f] !== undefined) data[f] = body[f]; });
    data.UpdatedBy = body.UpdatedBy || 'admin';
    data.UpdatedOn = new Date().toISOString().slice(0, 19).replace('T', ' ');
    await update('mst_servicedata', data, 'ServiceID = ?', [id]);
    const updated = await queryOne<Service>('SELECT * FROM mst_servicedata WHERE ServiceID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Service updated successfully', data: updated });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Something went wrong while updating service', error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext<IdParams>) {
  try {
    const { id } = await context.params;
    const service = await queryOne<Service>('SELECT * FROM mst_servicedata WHERE ServiceID = ?', [id]);
    if (!service) return NextResponse.json({ status: false, message: 'Service not found' }, { status: 404 });
    await remove('mst_servicedata', 'ServiceID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Service deleted successfully' });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to delete service', error: (error as Error).message }, { status: 500 });
  }
}
