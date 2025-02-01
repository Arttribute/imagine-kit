"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, ImageIcon, DownloadIcon } from "lucide-react";
import { getImageBlob } from "@/utils/imageProcesing";
import QRCode from "react-qr-code";

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
 * - Programmatically clicks a hidden link to trigger download on desktop.
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

    // Clean up object URL after download
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading the image:", error);
  }
}

interface ImagesDisplayProps {
  images: string[];
  loading: boolean;
}

/**
 * ImagesDisplay Component
 * -----------------------
 * - Renders a grid of images or placeholders.
 * - Each image:
 *    1) Is displayed in a small thumbnail.
 *    2) Clicking it opens a Dialog with a larger preview.
 *    3) Includes a Download button (desktop) that triggers handleDownload.
 *    4) Includes a QR code that points to a forced-download API URL.
 */
export default function ImagesDisplay({ images, loading }: ImagesDisplayProps) {
  const [displayImages, setDisplayImages] = useState<string[]>([]);

  useEffect(() => {
    // If images array is a placeholder ["image"], skip
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
        {/* 1) LOADING STATE */}
        {loading && (
          <div className="col-span-2 p-2 h-96">
            <div className="bg-gray-100 h-full rounded-xl p-1">
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-700 mt-40" />
              </div>
            </div>
          </div>
        )}

        {/* 2) VALID IMAGES RENDERING */}
        {!loading &&
          hasValidImages &&
          displayImages.map((image, index) => {
            // Build the forced-download URL for the QR code
            // This calls our new Next.js API route: /api/download-image
            const downloadApiUrl = `/api/download?url=${encodeURIComponent(
              image
            )}&filename=image-${index}.png`;

            return (
              <div
                key={image}
                className={`p-0.5 ${
                  displayImages.length === 1 ? "col-span-2" : "col-span-1"
                }`}
              >
                {/* Thumbnail with Dialog */}
                <Dialog>
                  <DialogTrigger>
                    <Image
                      src={image}
                      alt={`Image ${index}`}
                      width={displayImages.length === 1 ? 400 : 200}
                      height={displayImages.length === 1 ? 400 : 200}
                      className="rounded-lg"
                    />
                  </DialogTrigger>

                  <DialogContent>
                    <div className="flex flex-col items-center">
                      <Image
                        src={image}
                        alt={`Image ${index}`}
                        width={512}
                        height={512}
                        className="rounded-lg m-1"
                      />
                    </div>

                    {/* QR Code + Download Button */}
                    <div className="absolute bottom-0 right-0 m-2 flex items-center space-x-4">
                      {/* 2a) The QR code links to downloadApiUrl */}
                      <div className="bg-white p-2 rounded-md shadow-md">
                        <QRCode
                          value={downloadApiUrl}
                          size={80}
                          bgColor="#FFFFFF"
                          fgColor="#000000"
                          level="L" // "L", "M", "Q", or "H" for error correction
                        />
                      </div>

                      {/* 2b) Desktop Download Button */}
                      <button
                        onClick={() =>
                          handleDownload(image, `image-${index}.png`)
                        }
                        className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold p-2 rounded-lg"
                      >
                        <DownloadIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* 3) Optional Download Button on the Thumbnail */}
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
          })}

        {/* 3) NO VALID IMAGES RENDERED */}
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
