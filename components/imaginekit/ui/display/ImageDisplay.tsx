"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, ImageIcon, DownloadIcon, QrCodeIcon } from "lucide-react";
import QRCode from "react-qr-code";
import { getImageBlob } from "@/utils/imageProcesing";

/**
 * A helper function to verify if a string is a valid URL.
 */
function isValidUrl(url: string): boolean {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * handleDownload:
 * - Fetches the image as a blob
 * - Creates an object URL
 * - Programmatically clicks a hidden link to trigger download (desktop).
 */
async function handleDownload(imageSrc: string, fileName: string) {
  try {
    const blob = await getImageBlob(imageSrc);
    if (!blob) {
      console.error("Error fetching image blob");
      return;
    }
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up object URL
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading the image:", error);
  }
}

/**
 * A subcomponent to render a single image + dialog.
 * Manages its own state for toggling between image preview and QR code.
 */
function SingleImageItem({
  image,
  index,
  totalImages,
}: {
  image: string;
  index: number;
  totalImages: number;
}) {
  const [isQrVisible, setIsQrVisible] = useState(false);

  // The forced-download (fallback) URL:
  // If forced download fails, the server route will show the image in browser.
  const downloadApiUrl = `https://www.imaginekit.io/api/download?url=${encodeURIComponent(
    image
  )}&filename=image-${index}.png`;

  // Toggle function to switch between Image and QR Code
  const toggleQr = () => setIsQrVisible((prev) => !prev);

  return (
    <div className={`p-0.5 ${totalImages === 1 ? "col-span-2" : "col-span-1"}`}>
      <Dialog>
        <DialogTrigger>
          <Image
            src={image}
            alt={`Image ${index}`}
            width={totalImages === 1 ? 400 : 200}
            height={totalImages === 1 ? 400 : 200}
            className="rounded-lg"
          />
        </DialogTrigger>

        <DialogContent>
          <div className="flex flex-col items-center">
            {/* Conditionally render either the Image or the large QR code */}
            {isQrVisible ? (
              <QRCode
                value={downloadApiUrl}
                size={440} // Increase size for visibility
                bgColor="#FFFFFF"
                fgColor="#000000"
                level="L"
                className="my-4 rounded-lg m-1"
              />
            ) : (
              <Image
                src={image}
                alt={`Image ${index}`}
                width={512}
                height={512}
                className="rounded-lg m-1"
              />
            )}
          </div>

          {/* Bottom-right buttons: Toggle QR + Download */}
          <div className="absolute bottom-0 right-0 m-2 flex items-center space-x-2">
            {/* Button to toggle between QR code and Image */}
            <button
              onClick={toggleQr}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold p-2 rounded-lg"
            >
              {isQrVisible ? (
                <ImageIcon className="w-4 h-4" />
              ) : (
                <QrCodeIcon className="w-4 h-4" />
              )}
            </button>

            {/* Desktop Download Button */}
            <button
              onClick={() => handleDownload(image, `image-${index}.png`)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold p-2 rounded-lg"
            >
              <DownloadIcon className="w-4 h-4" />
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Optional Download button on the thumbnail itself */}
      <div className="absolute bottom-0 right-0 m-2">
        <button
          onClick={() => handleDownload(image, `image-${index}.png`)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold p-2 mr-3 mb-5 rounded-lg"
        >
          <DownloadIcon className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

/**
 * ImagesDisplay Component
 * -----------------------
 * - Renders a grid of image placeholders or images.
 * - Each image is handled by SingleImageItem (with its own state).
 */
export default function ImagesDisplay({
  images,
  loading,
}: {
  images: string[];
  loading: boolean;
}) {
  const [displayImages, setDisplayImages] = useState<string[]>([]);

  useEffect(() => {
    // If images array is just ["image"] placeholder, skip
    if (images.length === 1 && images[0] === "image") {
      return;
    }
    setDisplayImages(images);
  }, [images]);

  const hasValidImages =
    displayImages && displayImages.length > 0 && displayImages.some(isValidUrl);

  return (
    <div className="border p-0.5 rounded-xl w-96">
      <div className="grid grid-cols-2">
        {/* LOADING STATE */}
        {loading && (
          <div className="col-span-2 p-2 h-96">
            <div className="bg-gray-100 h-full rounded-xl p-1">
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-700 mt-40" />
              </div>
            </div>
          </div>
        )}

        {/* VALID IMAGES RENDERING */}
        {!loading &&
          hasValidImages &&
          displayImages.map((image, index) => (
            <SingleImageItem
              key={image}
              image={image}
              index={index}
              totalImages={displayImages.length}
            />
          ))}

        {/* NO VALID IMAGES */}
        {!loading && !hasValidImages && (
          <div className="col-span-2 p-2 h-96">
            <div className="bg-gray-100 h-full rounded-xl">
              <div className="flex flex-col items-center justify-center p-4">
                <ImageIcon className="w-8 h-8 mt-36 text-gray-500" />
                <p className="text-xs text-gray-700 text-center">
                  Images will be displayed here
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
