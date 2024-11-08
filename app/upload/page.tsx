'use client';

import FileUploader from '../components/FileUploader';


export default function UploadPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Enviar Nota Fiscal</h1>
      <FileUploader />
    </div>
  );
}
