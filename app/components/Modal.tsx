// app/components/Modal.tsx

import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface ModalProps {
  imageData: string;
  onClose: () => void;
}

export default function Modal({ imageData, onClose }: ModalProps) {
  const [fornecedor, setFornecedor] = useState('');
  const [numeroNota, setNumeroNota] = useState('');
  const [categoria, setCategoria] = useState('MERCEARIA');
  const [isLoading, setIsLoading] = useState(false);

  const categorias = ['MERCEARIA', 'PERECÍVEIS', 'FLV', 'EMBALAGEM', 'HB'];

  const handleSubmit = async () => {
    setIsLoading(true);
  
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: JSON.stringify({
        fornecedor,
        numeroNota,
        categoria,
        imageData,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    setIsLoading(false);
  
    if (response.ok) {
      toast.success('Nota fiscal salva com sucesso!');
      onClose();
    } else {
      toast.error('Erro ao salvar a nota fiscal.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>

      <div className="relative bg-black p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4 text-black">Informações da Nota Fiscal</h2>
        {/* Campos do formulário */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Fornecedor</label>
          <input
            type="text"
            value={fornecedor}
            onChange={(e) => setFornecedor(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Número da Nota Fiscal</label>
          <input
            type="text"
            value={numeroNota}
            onChange={(e) => setNumeroNota(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Categoria</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}
