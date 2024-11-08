// app/manage/page.tsx

'use client';

import { useEffect, useState } from 'react';

interface Note {
  id: string;
  fornecedor: string;
  numeroNota: string;
  categoria: string;
  data: string;
  filePath: string;
}

export default function ManageNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [filter, setFilter] = useState({
    data: '',
    categoria: '',
  });

  useEffect(() => {
    // Fetch notes from API
    const fetchNotes = async () => {
      const response = await fetch('/api/notes');
      const data = await response.json();
      setNotes(data);
      setFilteredNotes(data);
    };
    fetchNotes();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newFilter = { ...filter, [e.target.name]: e.target.value };
    setFilter(newFilter);

    const filtered = notes.filter((note) => {
      const matchData = newFilter.data ? note.data === newFilter.data : true;
      const matchCategoria = newFilter.categoria ? note.categoria === newFilter.categoria : true;
      return matchData && matchCategoria;
    });

    setFilteredNotes(filtered);
  };

  const categorias = ['', 'MERCEARIA', 'PERECÍVEIS', 'FLV', 'EMBALAGEM', 'HB'];

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Notas</h1>
      <div className="mb-4 flex space-x-4">
        <input
          type="date"
          name="data"
          value={filter.data}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          name="categoria"
          value={filter.categoria}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat || 'Todas as Categorias'}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-auto bg-white rounded shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b text-left text-gray-700">Fornecedor</th>
              <th className="py-2 px-4 border-b text-left text-gray-700">Número da Nota</th>
              <th className="py-2 px-4 border-b text-left text-gray-700">Categoria</th>
              <th className="py-2 px-4 border-b text-left text-gray-700">Data</th>
              <th className="py-2 px-4 border-b text-left text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredNotes.map((note) => (
              <tr key={note.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b text-gray-700">{note.fornecedor}</td>
                <td className="py-2 px-4 border-b text-gray-700">{note.numeroNota}</td>
                <td className="py-2 px-4 border-b text-gray-700">{note.categoria}</td>
                <td className="py-2 px-4 border-b text-gray-700">{note.data}</td>
                <td className="py-2 px-4 border-b">
                  <a
                    href={`/api/download?filePath=${encodeURIComponent(note.filePath)}`}
                    className="text-blue-500 hover:underline"
                  >
                    Baixar
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
