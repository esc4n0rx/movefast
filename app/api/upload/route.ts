// app/api/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { fileTypeFromBuffer } from 'file-type';

export async function POST(req: NextRequest) {
  const contentType = req.headers.get('content-type') || '';

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
  });

  if (contentType.includes('application/json')) {
    // Upload via câmera (imagem base64)
    const { fornecedor, numeroNota, categoria, imageData } = await req.json();

    const dataAtual = new Date().toISOString().split('T')[0];
    const fileName = `${fornecedor}_${numeroNota}_${dataAtual}`;

    // Remover o prefixo data URL
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    try {
      // Detectar o tipo de arquivo
      const fileInfo = await fileTypeFromBuffer(buffer);
      const resourceType = fileInfo?.mime.startsWith('image/') ? 'image' : 'raw';

      const readableStream = new Readable();
      readableStream.push(buffer);
      readableStream.push(null);

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `notas_fiscais/${categoria}`,
            public_id: fileName,
            resource_type: resourceType,
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

      return NextResponse.json({ message: 'Arquivo salvo com sucesso!', data: uploadResult });
    } catch (error) {
      console.error('Erro ao fazer upload para o Cloudinary:', error);
      return NextResponse.json({ message: 'Erro ao salvar o arquivo.' }, { status: 500 });
    }
  } else if (contentType.includes('multipart/form-data')) {
    // Upload via envio de arquivo (PDF ou imagem)
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const fornecedor = formData.get('fornecedor') as string;
    const numeroNota = formData.get('numeroNota') as string;
    const categoria = formData.get('categoria') as string;

    if (!file || !fornecedor || !numeroNota || !categoria) {
      return NextResponse.json({ message: 'Dados incompletos.' }, { status: 400 });
    }

    const dataAtual = new Date().toISOString().split('T')[0];
    const fileName = `${fornecedor}_${numeroNota}_${dataAtual}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    try {
      // Detectar o tipo de arquivo
      const fileInfo = await fileTypeFromBuffer(buffer);
      let resourceType: 'image' | 'raw' = 'raw';

      if (fileInfo?.mime.startsWith('image/')) {
        resourceType = 'image';
      }

      const readableStream = new Readable();
      readableStream.push(buffer);
      readableStream.push(null);

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `notas_fiscais/${categoria}`,
            public_id: fileName,
            resource_type: resourceType,
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

      return NextResponse.json({ message: 'Arquivo salvo com sucesso!', data: uploadResult });
    } catch (error) {
      console.error('Erro ao fazer upload para o Cloudinary:', error);
      return NextResponse.json({ message: 'Erro ao salvar o arquivo.' }, { status: 500 });
    }
  } else {
    return new NextResponse('Unsupported Content Type', { status: 415 });
  }
}
