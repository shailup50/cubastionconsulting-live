import { NextResponse } from 'next/server';
import { queryOne, update, remove } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const testimonial = await queryOne('SELECT * FROM mst_testimonialdata WHERE TestimonialID = ?', [id]);
    if (!testimonial) return NextResponse.json({ status: false, message: 'Testimonial not found' }, { status: 404 });
    return NextResponse.json({ status: true, data: testimonial });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Error fetching testimonial', error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const testimonial = await queryOne('SELECT * FROM mst_testimonialdata WHERE TestimonialID = ?', [id]);
    if (!testimonial) return NextResponse.json({ status: false, message: 'Testimonial not found' }, { status: 404 });
    const body = await req.json();
    const data = {};
    ['TestimonialName','TestimonialDescription','TestimonialImage','TestimonialLogo','TestimonialVideo','DisplayOrder','ActiveStatus'].forEach(f => { if (body[f] !== undefined) data[f] = body[f]; });
    data.UpdatedBy = body.UpdatedBy || 'admin';
    data.UpdatedOn = new Date().toISOString().slice(0, 19).replace('T', ' ');
    await update('mst_testimonialdata', data, 'TestimonialID = ?', [id]);
    const updated = await queryOne('SELECT * FROM mst_testimonialdata WHERE TestimonialID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Testimonial updated successfully', data: updated });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Something went wrong while updating testimonial', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const testimonial = await queryOne('SELECT * FROM mst_testimonialdata WHERE TestimonialID = ?', [id]);
    if (!testimonial) return NextResponse.json({ status: false, message: 'Testimonial not found' }, { status: 404 });
    await remove('mst_testimonialdata', 'TestimonialID = ?', [id]);
    return NextResponse.json({ status: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to delete testimonial', error: error.message }, { status: 500 });
  }
}
