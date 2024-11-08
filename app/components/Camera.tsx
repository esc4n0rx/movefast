
'use client';

import { useRef, useState } from 'react';
import Modal from './Modal';

export default function Camera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [imageData, setImageData] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Erro ao acessar a câmera:', error);
      alert('Não foi possível acessar a câmera. Por favor, verifique as permissões.');
    }
  };

  const switchCamera = () => {
    setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'));
    startCamera();
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

      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());

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
              onClick={switchCamera}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Alternar Câmera
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
