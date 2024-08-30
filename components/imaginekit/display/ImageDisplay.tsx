import React from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import DraggableItem from "@/components/DraggableItem";

export default function ImagesDisplay({ images }: { images: string[] }) {
  return (
    <DraggableItem id="images-display">
      <div className="border p-0.5 m-2 rounded-lg w-96">
        <div className="grid grid-cols-2">
          {images.map((image, index) => (
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
        </div>
      </div>
    </DraggableItem>
  );
}
