import { NextResponse } from 'next/server';
import { writeFile, unlink, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'uploads';
    const fileName = formData.get('fileName');
    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }
    if (!fileName) {
      return NextResponse.json({ success: false, message: 'No filename provided' }, { status: 400 });
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = path.join(process.cwd(), folder);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const baseName = path.parse(fileName).name;
    try {
      const existingFiles = await import('fs/promises').then(fs => fs.readdir(uploadDir));
      for (const existingFile of existingFiles) {
        if (existingFile.startsWith(baseName + '.')) {
          await import('fs/promises').then(fs => fs.unlink(path.join(uploadDir, existingFile)));
        }
      }
    } catch (e) {
    }

    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      fileName: fileName,
      path: `/${folder}/${fileName}`
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, message: 'Upload failed', error: error.message }, { status: 500 });
  }
}
