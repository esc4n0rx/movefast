// app/api/notes/route.ts

import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  const dirPath = path.join(process.cwd(), 'app', 'notas_fiscais');
  const categorias = await fs.readdir(dirPath);

  const notes = [];

  for (const categoria of categorias) {
    const categoriaPath = path.join(dirPath, categoria);
    const files = await fs.readdir(categoriaPath);

    for (const file of files) {
      const [fornecedor, numeroNota, dataCompleta] = file.split('_');
      const [data] = dataCompleta.split('.');

      notes.push({
        id: `${categoria}-${file}`,
        fornecedor,
        numeroNota,
        categoria,
        data,
        filePath: path.join('/app/notas_fiscais', categoria, file),
      });
    }
  }

  return NextResponse.json(notes);
}
