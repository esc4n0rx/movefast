// app/api/upload-bulk/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

export async function POST(req: NextRequest) {
  const contentType = req.headers.get('content-type') || '';

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
  });

  if (contentType.includes('multipart/form-data')) {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const categoria = formData.get('categoria') as string;

    const dataAtual = new Date().toISOString().split('T')[0];

    if (!files || files.length === 0) {
      return NextResponse.json({ message: 'Nenhum arquivo enviado.' }, { status: 400 });
    }

    try {
      const uploadPromises = files.map(async (file, index) => {
        const fileName = `NOTA FISCAL ${index + 1}_${dataAtual}`;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const readableStream = new Readable();
        readableStream.push(buffer);
        readableStream.push(null);

        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: `notas_fiscais/${categoria}`,
              public_id: fileName,
              resource_type: 'auto',
            },
            (error, result) => {
              if (error) {
                console.error('Erro ao fazer upload para o Cloudinary:', error);
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          readableStream.pipe(stream);
        });

        return uploadResult;
      });

      const uploadResults = await Promise.all(uploadPromises);

      return NextResponse.json({ message: 'Arquivos salvos com sucesso!', data: uploadResults });
    } catch (error) {
      console.error('Erro ao fazer upload para o Cloudinary:', error);
      return NextResponse.json({ message: 'Erro ao salvar os arquivos.' }, { status: 500 });
    }
  } else {
    return new NextResponse('Unsupported Content Type', { status: 415 });
  }
}
