import { NextResponse } from 'next/server';
import { query, insert } from '@/lib/db';

export async function GET() {
  try {
    const testimonials = await query('SELECT * FROM mst_testimonialdata ORDER BY TestimonialID DESC');
    return NextResponse.json({ status: true, data: testimonials });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to fetch testimonials', error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { TestimonialName, DisplayOrder, ActiveStatus } = body;
    if (!TestimonialName || DisplayOrder === undefined || ActiveStatus === undefined) {
      return NextResponse.json({ status: false, message: 'TestimonialName, DisplayOrder, ActiveStatus are required' }, { status: 422 });
    }
    const data = {};
    ['TestimonialName','TestimonialDescription','TestimonialImage','TestimonialLogo','TestimonialVideo','DisplayOrder','ActiveStatus'].forEach(f => { if (body[f] !== undefined) data[f] = body[f]; });
    data.PostedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const result = await insert('mst_testimonialdata', data);
    const testimonial = await query('SELECT * FROM mst_testimonialdata WHERE TestimonialID = ?', [result.insertId]);
    return NextResponse.json({ status: true, message: 'Testimonial created successfully', data: testimonial[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Something went wrong while creating testimonial', error: error.message }, { status: 500 });
  }
}
