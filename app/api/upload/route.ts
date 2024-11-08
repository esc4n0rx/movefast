// app/api/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  const contentType = req.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const { fornecedor, numeroNota, categoria, imageData } = await req.json();

    const dataAtual = new Date().toISOString().split('T')[0];
    const fileName = `${fornecedor}_${numeroNota}_${dataAtual}.png`;

    const dirPath = path.join(process.cwd(), 'app', 'notas_fiscais', categoria);
    await fs.mkdir(dirPath, { recursive: true });

    const filePath = path.join(dirPath, fileName);
    const base64Data = imageData.replace(/^data:image\/png;base64,/, '');

    await fs.writeFile(filePath, base64Data, 'base64');

    return NextResponse.json({ message: 'Arquivo salvo com sucesso!' });
  } else if (contentType.includes('multipart/form-data')) {

    const formData = await req.formData();
    const file = formData.get('file') as Blob;
    const fornecedor = formData.get('fornecedor') as string;
    const numeroNota = formData.get('numeroNota') as string;
    const categoria = formData.get('categoria') as string;

    const dataAtual = new Date().toISOString().split('T')[0];
    const fileName = `${fornecedor}_${numeroNota}_${dataAtual}.pdf`;

    const dirPath = path.join(process.cwd(), 'app', 'notas_fiscais', categoria);
    await fs.mkdir(dirPath, { recursive: true });

    const filePath = path.join(dirPath, fileName);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ message: 'Arquivo salvo com sucesso!' });
  } else {
    return new NextResponse('Unsupported Content Type', { status: 415 });
  }
}
