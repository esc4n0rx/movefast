// app/api/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

export async function POST(req: NextRequest) {
  const contentType = req.headers.get('content-type') || '';


  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
  });

  if (contentType.includes('application/json')) {
    const { fornecedor, numeroNota, categoria, imageData } = await req.json();

    const dataAtual = new Date().toISOString().split('T')[0];
    const fileName = `${fornecedor}_${numeroNota}_${dataAtual}`;

    // Remover o prefixo data URL
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');

    // Criar um buffer a partir dos dados base64
    const buffer = Buffer.from(base64Data, 'base64');

    try {
      // Criar um stream legível a partir do buffer
      const readableStream = new Readable();
      readableStream.push(buffer);
      readableStream.push(null);

      // Retornar uma promessa para aguardar o upload
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `notas_fiscais/${categoria}`,
            public_id: fileName,
            resource_type: 'image',
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
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const fornecedor = formData.get('fornecedor') as string;
    const numeroNota = formData.get('numeroNota') as string;
    const categoria = formData.get('categoria') as string;

    const dataAtual = new Date().toISOString().split('T')[0];
    const fileName = `${fornecedor}_${numeroNota}_${dataAtual}`;

    // Ler o arquivo como buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    try {
      // Criar um stream legível a partir do buffer
      const readableStream = new Readable();
      readableStream.push(buffer);
      readableStream.push(null);

      // Retornar uma promessa para aguardar o upload
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

      return NextResponse.json({ message: 'Arquivo salvo com sucesso!', data: uploadResult });
    } catch (error) {
      console.error('Erro ao fazer upload para o Cloudinary:', error);
      return NextResponse.json({ message: 'Erro ao salvar o arquivo.' }, { status: 500 });
    }
  } else {
    return new NextResponse('Unsupported Content Type', { status: 415 });
  }
}
