// app/components/Camera.tsx

'use client';

import { useRef, useState } from 'react';
import Modal from './Modal';

export default function Camera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [imageData, setImageData] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    if (videoRef.current) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas
        .getContext('2d')
        ?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setImageData(dataUrl);

      // Parar o stream
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());

      // Mostrar o modal para inserir informações
      setShowModal(true);
    }
  };

  return (
    <div>
      {!imageData ? (
        <div>
          <video ref={videoRef} autoPlay className="w-full h-auto bg-black" />
          <div className="mt-4 flex space-x-4">
            <button
              onClick={startCamera}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Iniciar Câmera
            </button>
            <button
              onClick={captureImage}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Capturar
            </button>
          </div>
        </div>
      ) : (
        <div>
          <img src={imageData} alt="Nota Fiscal" className="w-full h-auto" />
        </div>
      )}
      {showModal && (
        <Modal
          imageData={imageData}
          onClose={() => {
            setShowModal(false);
            setImageData('');
          }}
        />
      )}
    </div>
  );
}
