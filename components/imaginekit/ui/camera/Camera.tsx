"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { CameraIcon, ArrowUpIcon, DownloadIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Camera({
  onPhotoSubmit,
  loading,
}: {
  onPhotoSubmit: (photo: string) => void;
  loading: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Start camera stream
  const startCamera = async () => {
    try {
      // Check if HTTPS is required
      if (
        window.location.protocol !== "https:" &&
        process.env.NODE_ENV === "production"
      ) {
        throw new Error("Camera access requires HTTPS in production.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use 'user' for the front camera
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsStreaming(true);
      setError(null);
    } catch (err) {
      console.error("Error accessing the camera", err);
      setError("Unable to access the camera. Please check permissions.");
    }
  };

  // Capture photo
  const takePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(
          videoRef.current,
          0,
          0,
          videoRef.current.videoWidth,
          videoRef.current.videoHeight
        );
        const photo = canvasRef.current.toDataURL("image/png");
        setPhotoData(photo);
      }
    }
  };

  // Handle download of the photo
  const handleDownload = async (imageSrc: string, fileName: string) => {
    try {
      const blob = await fetch(imageSrc).then((res) => res.blob());
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the image:", error);
    }
  };

  // Handle submission of the photo
  const handleSubmitPhoto = () => {
    if (photoData) {
      onPhotoSubmit(photoData);
    }
  };

  useEffect(() => {
    startCamera();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-96 h-96 border border-gray-300 shadow-2xl p-2 rounded-xl">
      {isStreaming && !error && (
        <video
          ref={videoRef}
          className="w-full h-auto rounded-lg border border-indigo-300"
          autoPlay
          playsInline
          muted
        ></video>
      )}
      {/* Display error message if there's an issue */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Placeholder waiting for camera feed */}
      {!isStreaming && !error && (
        <div className="flex items-center justify-center w-full h-64 bg-gray-100  rounded-lg border border-indigo-300">
          <CameraIcon className="w-12 h-12 text-gray-400" />
        </div>
      )}

      {/* Camera controls */}
      <div className="flex items-center justify-center w-full mt-1">
        <div className="flex-none w-16">
          {photoData && (
            <Dialog>
              <DialogTrigger asChild>
                <div className="p-0.5 border border-gray-300 w-12 h-12 rounded-md">
                  <Image
                    src={photoData}
                    alt="Captured"
                    width={30}
                    height={30}
                    className="w-full h-full object-cover aspect-[1/1] rounded-sm shadow-md"
                  />
                </div>
              </DialogTrigger>
              <DialogContent>
                <div className="flex flex-col items-center">
                  <Image
                    src={photoData}
                    alt={"Captured"}
                    width={512}
                    height={512}
                    className="rounded-lg m-1 border"
                  />
                </div>
                <div className="absolute bottom-0 right-0 m-2">
                  <button
                    onClick={() => handleDownload(photoData, `photo.png`)}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold p-2 mr-5 mb-6 rounded-lg"
                  >
                    <DownloadIcon className="w-4 h-4" />
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <div className="grow flex justify-center items-center">
          <button
            onClick={takePhoto}
            className="p-1 mt-2 border rounded-full shadow-md hover:bg-gray-50"
          >
            <div className="p-3 border border-red-200 rounded-full">
              <CameraIcon className="w-5 h-5 text-red-500" />
            </div>
          </button>
        </div>
        <div className="flex-none ">
          {photoData && !loading ? (
            <Button
              onClick={handleSubmitPhoto}
              className={`py-6 px-4 rounded-xl ${""}`}
            >
              <ArrowUpIcon className="h-4 w-4" />
            </Button>
          ) : (
            <Button disabled className={`py-6 px-4  rounded-xl ${""}`}>
              <ArrowUpIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
}
