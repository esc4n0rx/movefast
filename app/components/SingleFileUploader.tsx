// components/SingleFileUploader.tsx

'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function SingleFileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [fornecedor, setFornecedor] = useState('');
  const [numeroNota, setNumeroNota] = useState('');
  const [categoria, setCategoria] = useState('MERCEARIA');
  const [isLoading, setIsLoading] = useState(false);

  const categorias = ['MERCEARIA', 'PERECÍVEIS', 'FLV', 'EMBALAGEM', 'HB'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (): Promise<void> => {
    if (!file) {
      toast.error('Por favor, selecione um arquivo.');
      return;
    }

    if (!fornecedor || !numeroNota) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fornecedor', fornecedor);
    formData.append('numeroNota', numeroNota);
    formData.append('categoria', categoria);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    setIsLoading(false);

    if (response.ok) {
      toast.success('Nota fiscal enviada com sucesso!');
      setFile(null);
      setFornecedor('');
      setNumeroNota('');
      setCategoria('MERCEARIA');
    } else {
      toast.error('Erro ao enviar a nota fiscal.');
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md max-w-md mx-auto">
      <div className="mb-4">
        <input
          type="file"
          accept="application/pdf,image/*"
          onChange={handleFileChange}
          className="w-full text-gray-800"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-gray-800">Fornecedor</label>
        <input
          type="text"
          value={fornecedor}
          onChange={(e) => setFornecedor(e.target.value)}
          className="w-full border px-3 py-2 rounded text-gray-800"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-gray-800">Número da Nota Fiscal</label>
        <input
          type="text"
          value={numeroNota}
          onChange={(e) => setNumeroNota(e.target.value)}
          className="w-full border px-3 py-2 rounded text-gray-800"
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
