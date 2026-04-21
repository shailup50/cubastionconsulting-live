import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

export async function GET(req, { params }) {
  try {
    const resolvedParams = await params;
    if (!resolvedParams || !resolvedParams.path) {
      return NextResponse.json({ error: 'Path not provided' }, { status: 400 });
    }
    const imagePath = resolvedParams.path.join('/');
    const fullPath = path.join(process.cwd(), 'uploads', imagePath);
    if (!fullPath.startsWith(path.join(process.cwd(), 'uploads'))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (!existsSync(fullPath)) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const fileBuffer = readFileSync(fullPath);

    const ext = path.extname(fullPath).toLowerCase();
    let contentType = 'image/jpeg';
    if (ext === '.png') contentType = 'image/png';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.svg') contentType = 'image/svg+xml';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
