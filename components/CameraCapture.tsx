
import React, { useRef, useState, useEffect } from 'react';
import { X, RefreshCw } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (blobUrl: string) => void;
  onCancel: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          aspectRatio: 3/4
        },
        audio: false
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError("Unable to access camera. Please check permissions.");
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        // Flip horizontal if it's the front camera
        if (facingMode === 'user') {
          context.translate(canvas.width, 0);
          context.scale(-1, 1);
        }
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(dataUrl);
      }
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-zinc-950">
        <p className="text-zinc-400 mb-6">{error}</p>
        <button onClick={onCancel} className="text-white border border-white/20 px-6 py-2 rounded-full">Go Back</button>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-black overflow-hidden flex flex-col">
      <div className="flex-1 relative">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className={`h-full w-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
        />
        
        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
          <button onClick={onCancel} className="p-2 text-white">
            <X size={28} strokeWidth={1.5} />
          </button>
          <button onClick={toggleCamera} className="p-2 text-white">
            <RefreshCw size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Shutter Button */}
        <div className="absolute bottom-12 left-0 right-0 flex justify-center">
          <button 
            onClick={takePhoto}
            className="w-20 h-20 rounded-full border-[4px] border-white/40 flex items-center justify-center active:scale-90 transition-transform"
          >
            <div className="w-16 h-16 rounded-full bg-white"></div>
          </button>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;
