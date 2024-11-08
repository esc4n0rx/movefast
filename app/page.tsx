// app/page.tsx

import Link from 'next/link';

export default function HomePage() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/image.png')" }}
    >
      <h1 className="text-4xl font-bold mb-8 text-white">Controle de Notas Fiscais</h1>
      <div className="space-y-4">
        <Link
          href="/scan"
          className="block px-6 py-3 bg-blue-500 bg-opacity-75 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300 text-center"
        >
          Scannear Nota
        </Link>
        <Link
          href="/upload"
          className="block px-6 py-3 bg-green-500 bg-opacity-75 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300 text-center"
        >
          Enviar Nota
        </Link>
        <Link
          href="/manage"
          className="block px-6 py-3 bg-gray-500 bg-opacity-75 text-white rounded-lg shadow-md hover:bg-gray-600 transition duration-300 text-center"
        >
          Gerenciar Notas
        </Link>
      </div>
    </div>
  );
}
