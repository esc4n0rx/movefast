// app/api/download/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filePath = searchParams.get('filePath');

  if (!filePath) {
    return new NextResponse('File path is required', { status: 400 });
  }

  // Configurar o Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
  });

  try {
    // Gerar um URL seguro para o arquivo com o parâmetro 'attach' para download
    const url = cloudinary.url(filePath, {
      secure: true,
      resource_type: 'auto',
      flags: 'attachment',
    });

    // Redirecionar o usuário para o URL do arquivo
    return NextResponse.redirect(url);
  } catch (error) {
    console.error('Erro ao gerar URL do Cloudinary:', error);
    return new NextResponse('File not found', { status: 404 });
  }
}
