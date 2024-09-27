import React from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, ImageIcon } from "lucide-react";

function isValidUrl(url: string) {
  if (url) {
    return (
      url.startsWith("/") ||
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("data:image")
    );
  }
}

export default function ImagesDisplay({
  images,
  loading,
}: {
  images: string[];
  loading: boolean;
}) {
  return (
    <div className="border p-0.5 m-2 rounded-xl w-96">
      <div className="grid grid-cols-2">
        {!loading &&
          images.length > 0 &&
          isValidUrl(images[0]) &&
          images &&
          images.map((image, index) => (
            <div
              key={index}
              className={`p-0.5 ${
                images.length == 1 ? "col-span-2" : "col-span-1"
              }`}
            >
              <Dialog>
                <DialogTrigger>
                  <Image
                    src={image}
                    alt={image}
                    width={images.length == 1 ? 400 : 200}
                    height={images.length == 1 ? 400 : 200}
                    className="rounded-lg"
                  />
                </DialogTrigger>
                <DialogContent>
                  <Image
                    src={image}
                    alt={image}
                    width={512}
                    height={512}
                    className="rounded-lg m-1"
                  />
                </DialogContent>
              </Dialog>
            </div>
          ))}
        {!isValidUrl(images[0]) ||
          (images.length === 0 && (
            <div className="col-span-2 p-2 h-96 p-1">
              <div className="bg-gray-100 h-full rounded-xl p-1">
                <div className="flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-700 mt-40" />
                </div>
              </div>
            </div>
          ))}
        {loading && (
          <div className="col-span-2 p-2 h-96 p-1">
            <div className="bg-gray-100 h-full rounded-xl p-1">
              <div className="flex flex-col items-center justify-center ">
                <Loader2 className="w-8 h-8 animate-spin text-gray-700 mt-40" />
              </div>
            </div>
          </div>
        )}

        {!loading && !isValidUrl(images[0]) && (
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
