import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const industries = await query("SELECT IndustryName, IndustryNameURL, IndustryImage, IndustryTagLine, Description FROM mst_industrydata WHERE ActiveStatus = 1 ORDER BY DisplayOrder ASC");
    const logos = await query("SELECT LogoName, LogoNameURL, LogoImage1 FROM mst_logodata WHERE ActiveStatus = 1 ORDER BY DisplayOrder ASC");
    const blogs = await query("SELECT PortfolioName, PortfolioNameURL, PortfolioImage, PortfolioTopHeading FROM mst_portfoliodata WHERE ActiveStatus = 1 AND PortfolioType = 'CaseStudy' ORDER BY DisplayOrder ASC");
    const testimonials = await query("SELECT TestimonialName, TestimonialImage, TestimonialLogo, TestimonialVideo, TestimonialDescription FROM mst_testimonialdata WHERE ActiveStatus = 1 ORDER BY DisplayOrder ASC");
    const awardlogos = await query("SELECT LogoName, LogoNameURL, LogoImage1 FROM mst_logodata WHERE ActiveStatus = 0 ORDER BY DisplayOrder ASC");
    return NextResponse.json({ status: true, data: { industries, logos, blogs, testimonials, awardlogos } });
  } catch (error) {
    return NextResponse.json({ status: false, message: 'Failed to fetch home data', error: error.message }, { status: 500 });
  }
}
