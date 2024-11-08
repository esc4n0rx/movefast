// app/upload/page.tsx

'use client';

import { useState } from 'react';
import SingleFileUploader from '../components/SingleFileUploader';
import BulkFileUploader from '../components/BulkFileUploader';

export default function UploadPage() {
  const [isBulkUpload, setIsBulkUpload] = useState(false);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Enviar Nota Fiscal</h1>
      <div className="mb-4">
        <button
          onClick={() => setIsBulkUpload(false)}
          className={`px-4 py-2 mr-2 ${!isBulkUpload ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} rounded`}
        >
          Envio Individual
        </button>
        <button
          onClick={() => setIsBulkUpload(true)}
          className={`px-4 py-2 ${isBulkUpload ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} rounded`}
        >
          Envio em Massa
        </button>
      </div>
      {isBulkUpload ? <BulkFileUploader /> : <SingleFileUploader />}
    </div>
  );
}
