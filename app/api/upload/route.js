import { NextResponse } from 'next/server';
import { writeFile, unlink, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

function resolveAllowedFolder(folder) {
  const cleanFolder = String(folder || '').replace(/\\/g, '/').replace(/^\/+/, '');
  const [root, ...restParts] = cleanFolder.split('/').filter(Boolean);
  const rootMap = {
    uploads: path.join(/*turbopackIgnore: true*/ process.cwd(), 'uploads'),
    public: path.join(/*turbopackIgnore: true*/ process.cwd(), 'public'),
  };
  const baseDir = rootMap[root];
  if (!baseDir) return null;

  const restPath = restParts.join('/');
  const targetDir = restPath ? path.resolve(baseDir, restPath) : baseDir;
  if (!targetDir.startsWith(baseDir)) return null;
  return targetDir;
}

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
    const safeFileName = path.basename(String(fileName));
    if (!safeFileName) {
      return NextResponse.json({ success: false, message: 'Invalid filename' }, { status: 400 });
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = resolveAllowedFolder(folder);
    if (!uploadDir) {
      return NextResponse.json({ success: false, message: 'Invalid folder path' }, { status: 400 });
    }

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const baseName = path.parse(safeFileName).name;
    try {
      const existingFiles = await import('fs/promises').then(fs => fs.readdir(uploadDir));
      for (const existingFile of existingFiles) {
        if (existingFile.startsWith(baseName + '.')) {
          const existingPath = `${uploadDir}${path.sep}${existingFile}`;
          await import('fs/promises').then(fs => fs.unlink(existingPath));
        }
      }
    } catch (e) {
    }

    const filePath = `${uploadDir}${path.sep}${safeFileName}`;
    await writeFile(filePath, buffer);
    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      fileName: safeFileName,
      path: `/${String(folder).replace(/^\/+/, '')}/${safeFileName}`
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, message: 'Upload failed', error: error.message }, { status: 500 });
  }
}
