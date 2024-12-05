import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, ImageIcon, DownloadIcon } from "lucide-react";
import { getImageBlob } from "@/utils/imageProcesing";

function isValidUrl(url: string) {
  if (!url) {
    return false;
  }
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

const handleDownload = async (imageSrc: string, fileName: string) => {
  try {
    const blob = await getImageBlob(imageSrc);
    if (!blob) {
      console.error("Error fetching image");
      return;
    }
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url); // Clean up after download
  } catch (error) {
    console.error("Error downloading the image:", error);
  }
};

export default function ImagesDisplay({
  images,
  loading,
}: {
  images: string[];
  loading: boolean;
}) {
  const [displayImages, setDisplayImages] = useState<string[]>([]);

  useEffect(() => {
    // images contains only the string "image" and not the actual image data do not set displayImages
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
        {loading && (
          <div className="col-span-2 p-2 h-96 p-1">
            <div className="bg-gray-100 h-full rounded-xl p-1">
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-700 mt-40" />
              </div>
            </div>
          </div>
        )}

        {!loading &&
          hasValidImages &&
          displayImages.map((image, index) => (
            <div
              key={image}
              className={`p-0.5 ${
                displayImages.length == 1 ? "col-span-2" : "col-span-1"
              }`}
            >
              <Dialog>
                <DialogTrigger>
                  <Image
                    src={image}
                    alt={`Image ${index}`}
                    width={displayImages.length == 1 ? 400 : 200}
                    height={displayImages.length == 1 ? 400 : 200}
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
                  <div className="absolute bottom-0 right-0 m-2">
                    <button
                      onClick={() =>
                        handleDownload(image, `image-${index}.png`)
                      }
                      className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold p-2 mr-5 mb-6 rounded-lg"
                    >
                      <DownloadIcon className="w-4 h-4" />
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
              {/* Download button for initial display */}
              <div className="absolute bottom-0 right-0 m-2">
                <button
                  onClick={() => handleDownload(image, `image-${index}.png`)}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold p-2 mr-3 mb-5 rounded-lg"
                >
                  <DownloadIcon className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}

        {!loading && !hasValidImages && (
          <div className="col-span-2 p-2 h-96 p-1">
            <div className="bg-gray-100 h-full rounded-xl">
              <div className="flex flex-col items-center justify-center p-4 ">
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
