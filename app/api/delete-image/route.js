import { NextResponse } from 'next/server';
import { existsSync, readdirSync } from 'fs';
import { unlink } from 'fs/promises';
import path from 'path';

export async function POST(req) {
  try {
    const body = await req.json();
    const { fileName, folder } = body;

    if (!fileName || !folder) {
      return NextResponse.json({ success: false, message: 'fileName and folder are required' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), folder);
    if (!existsSync(uploadDir)) {
      return NextResponse.json({ success: true, message: 'Folder does not exist, nothing to delete' });
    }

    const baseName = path.parse(fileName).name;
    const files = readdirSync(uploadDir);
    const deleted = [];

    for (const file of files) {
      if (file.startsWith(baseName + '.') || file === fileName) {
        const filePath = path.join(uploadDir, file);
        try {
          await unlink(filePath);
          deleted.push(file);
        } catch (e) {
          // ignore individual file errors
        }
      }
    }
    return NextResponse.json({ success: true, message: `Deleted ${deleted.length} file(s)`, deleted });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ success: false, message: 'Delete failed', error: error.message }, { status: 500 });
  }
}