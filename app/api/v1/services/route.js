import { NextResponse } from 'next/server';
import { query, insert } from '@/lib/db';

export async function GET() {
  try {
    const services = await query('SELECT * FROM mst_servicedata ORDER BY ServiceID DESC');
    return NextResponse.json({ status: true, data: services });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to fetch services', error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { ServiceName, ServiceNameURL, ServiceImage, DisplayOrder, ActiveStatus } = body;
    if (!ServiceName || !ServiceNameURL || !ServiceImage || DisplayOrder === undefined || ActiveStatus === undefined) {
      return NextResponse.json({ status: false, message: 'ServiceName, ServiceNameURL, ServiceImage, DisplayOrder, ActiveStatus are required' }, { status: 422 });
    }
    const existing = await query('SELECT ServiceID FROM mst_servicedata WHERE ServiceNameURL = ?', [ServiceNameURL]);
    if (existing.length) return NextResponse.json({ status: false, message: 'This service URL already exists' }, { status: 422 });
    const data = {};
    ['ServiceName','ServiceNameURL','ServiceImage','ServiceBannerImage','ServiceBannerImage1','ServiceTagLine','ServicePunchline','DescriptionHeading','Description','OtherDescriptionHeading','OtherDescription','DisplayOrder','ActiveStatus','MetaTitle','MetaKeywords','MetaDescriptions','MetaSchema','MetaOgImage'].forEach(f => { if (body[f] !== undefined) data[f] = body[f]; });
    data.PostedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const result = await insert('mst_servicedata', data);
    const service = await query('SELECT * FROM mst_servicedata WHERE ServiceID = ?', [result.insertId]);
    return NextResponse.json({ status: true, message: 'Service created successfully', data: service[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Something went wrong while creating service', error: error.message }, { status: 500 });
  }
}
