// app/api/notes/route.ts

import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

interface CloudinaryResource {
  public_id: string;
  format: string;
  created_at: string;
  secure_url: string;
}

export async function GET() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
  });

  try {
    const resources = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'notas_fiscais/',
      max_results: 500,
    });

    const notes = resources.resources.map((resource: CloudinaryResource) => {
      const { public_id, format, created_at, secure_url } = resource;

      const pathParts = public_id.split('/');
      const categoria = pathParts[1];
      const fileName = pathParts.slice(2).join('/');

      let fornecedor = '';
      let numeroNota = '';
      let dataNota = '';

      const fileNameParts = fileName.split('_');

      if (fileName.startsWith('NOTA FISCAL')) {
        numeroNota = fileNameParts[0].replace('NOTA FISCAL ', '');
        dataNota = fileNameParts[1];
        fornecedor = 'N/A';
      } else {
        fornecedor = fileNameParts[0];
        numeroNota = fileNameParts[1];
        dataNota = fileNameParts[2];
      }

      return {
        id: public_id,
        fornecedor,
        numeroNota,
        categoria,
        data: dataNota,
        filePath: public_id,
        url: secure_url,
        format,
      };
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Erro ao listar arquivos do Cloudinary:', error);
    return NextResponse.json({ message: 'Erro ao listar arquivos.' }, { status: 500 });
  }
}
