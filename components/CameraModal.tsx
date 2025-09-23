import React, { useState, useRef, useEffect } from 'react';
import Modal from './Modal';

interface CameraModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPhotoTaken: (dataUrl: string) => void;
}

const ShutterIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" clipRule="evenodd" />
    </svg>
);


const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onPhotoTaken }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    useEffect(() => {
        const startCamera = async () => {
            if (isOpen) {
                // Reset state for when modal re-opens
                setError(null);
                setIsCameraReady(false);
                setCapturedImage(null);
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                    streamRef.current = stream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.onloadedmetadata = () => {
                           setIsCameraReady(true);
                        }
                    }
                } catch (err) {
                    console.error("Camera access error:", err);
                    if (err instanceof DOMException && (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')) {
                        setError("Camera access was denied. Please grant permission in your browser settings.");
                    } else {
                        setError("Could not access the camera. Please ensure it is connected and not in use by another application.");
                    }
                }
            }
        };

        startCamera();

        // Cleanup function to stop the camera stream when the modal is closed or component unmounts
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
        };
    }, [isOpen]);

    const handleTakePhoto = () => {
        if (videoRef.current && canvasRef.current && isCameraReady) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            // Draw the current video frame onto the canvas
            context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            
            // Get the image data from the canvas as a JPEG
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9); // 0.9 quality
            setCapturedImage(dataUrl);
        }
    };

    const handleRetake = () => {
        setCapturedImage(null);
    };

    const handleConfirmPhoto = () => {
        if (capturedImage) {
            onPhotoTaken(capturedImage);
        }
    };


    return (
        <Modal isOpen={isOpen} onClose={onClose} title={capturedImage ? "Confirm Your Photo" : "Take a Photo"}>
            <div className="flex flex-col items-center">
                {error ? (
                    <div className="text-center p-4">
                        <p className="text-red-400 font-semibold">Camera Error</p>
                        <p className="text-gray-300 mt-2">{error}</p>
                    </div>
                ) : (
                    <div className="relative w-full aspect-square bg-black rounded-md overflow-hidden">
                        <canvas ref={canvasRef} className="hidden" />
                        {capturedImage ? (
                            <img src={capturedImage} alt="Captured preview" className="w-full h-full object-cover" />
                        ) : (
                            <>
                                <video 
                                    ref={videoRef} 
                                    autoPlay 
                                    playsInline 
                                    muted
                                    className={`w-full h-full object-cover transition-opacity duration-300 ${isCameraReady ? 'opacity-100' : 'opacity-0'}`}
                                />
                                {!isCameraReady && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black rounded-md">
                                        <p className="text-gray-400">Starting camera...</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                <div className="mt-6 flex w-full justify-center items-center h-16">
                    {!error && (
                        <>
                            {capturedImage ? (
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={handleRetake}
                                        className="px-6 py-2 rounded-full bg-gray-600 hover:bg-gray-500 font-semibold transition-colors"
                                    >
                                        Retake
                                    </button>
                                    <button
                                        onClick={handleConfirmPhoto}
                                        className="px-6 py-2 rounded-full aurora-gradient font-semibold transition-colors"
                                    >
                                        Use Photo
                                    </button>
                                </div>
                            ) : (
                                isCameraReady && (
                                    <button
                                        onClick={handleTakePhoto}
                                        className="w-16 h-16 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 transition-colors border-2 border-white"
                                        aria-label="Capture Photo"
                                    >
                                        <ShutterIcon />
                                    </button>
                                )
                            )}
                        </>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default CameraModal;