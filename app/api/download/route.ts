import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filePath = searchParams.get('filePath');

  if (!filePath) {
    return new NextResponse('File path is required', { status: 400 });
  }

  const absolutePath = path.join(process.cwd(), filePath);

  try {
    const file = await fs.readFile(absolutePath);
    const fileName = path.basename(absolutePath);
    const headers = new Headers();
    headers.set('Content-Disposition', `attachment; filename="${fileName}"`);

    return new NextResponse(file, {
      headers,
    });
  } catch (error) {
    return new NextResponse('File not found', { status: 404 });
  }
}
