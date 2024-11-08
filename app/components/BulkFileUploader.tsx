// components/BulkFileUploader.tsx

'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function BulkFileUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [categoria, setCategoria] = useState('MERCEARIA');
  const [isLoading, setIsLoading] = useState(false);

  const categorias = ['MERCEARIA', 'PERECÍVEIS', 'FLV', 'EMBALAGEM', 'HB'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Por favor, selecione pelo menos um arquivo.');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('categoria', categoria);

    const response = await fetch('/api/upload-bulk', {
      method: 'POST',
      body: formData,
    });

    setIsLoading(false);

    if (response.ok) {
      toast.success('Notas fiscais enviadas com sucesso!');
      setFiles([]);
      setCategoria('MERCEARIA');
    } else {
      toast.error('Erro ao enviar as notas fiscais.');
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md max-w-md mx-auto">
      <div className="mb-4">
        <input
          type="file"
          accept="application/pdf,image/*"
          multiple
          onChange={handleFileChange}
          className="w-full text-gray-800"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-gray-800">Categoria</label>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full border px-3 py-2 rounded text-gray-800"
        >
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Enviando...' : 'Enviar'}
      </button>
    </div>
  );
}
