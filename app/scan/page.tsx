// app/scan/page.tsx

'use client';

import Camera from '../components/Camera';


export default function ScanPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Scannear Nota Fiscal</h1>
      <Camera />
    </div>
  );
}
