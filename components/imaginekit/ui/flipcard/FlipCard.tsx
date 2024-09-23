"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DotPattern from "@/components/magicui/dot-pattern";

// Helper function to stop event propagation
const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

interface FlipCardProps {
  frontTitle?: string;
  backTitle?: string;
  frontContentText?: string;
  backContentText?: string;
  frontImageUrl?: string;
  backImageUrl?: string;
}

const CardSide: React.FC<{
  title?: string;
  contentText?: string;
  imageUrl?: string;
  showDialog?: boolean;
  isBack?: boolean;
}> = ({ title, contentText, imageUrl, showDialog = false, isBack = false }) => (
  <div
    className="absolute w-full h-full"
    style={{ backfaceVisibility: "hidden" }}
  >
    <div className="flex flex-col justify-center items-center border border-gray-400 bg-white rounded-2xl shadow-xl p-1 relative w-full h-full overflow-hidden rounded-xl">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover aspect-[6/9] rounded-xl"
        />
      )}
      {/* Centered title and content when no image */}
      {!imageUrl && (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          {title && <h3 className=" text-black font-semibold mb-2">{title}</h3>}
          {contentText && (
            <p className="text-xs text-gray-700">{contentText}</p>
          )}
        </div>
      )}
      {/* Title with overlay when there is an image */}
      {title && imageUrl && (
        <div className="absolute top-0 right-0 w-full h-15 bg-gray-700 bg-opacity-50 flex justify-center items-center">
          <h3 className="text-sm text-white font-semibold">{title}</h3>
        </div>
      )}
      {/* Dialog trigger for front content text */}
      {contentText && showDialog && imageUrl && (
        <div className="absolute bottom-2 w-full flex justify-center items-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mb-1" onClick={stopPropagation}>
                Read more
              </Button>
            </DialogTrigger>
            <DialogContent onClick={stopPropagation} className="max-w-2xl">
              <div className="grid grid-cols-12">
                <div className="col-span-6">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      className="aspect-[1] rounded-xl"
                      alt={title}
                    />
                  )}
                </div>
                <div className="col-span-6">
                  <div className="px-6">
                    <h2 className="text-2xl font-semibold mb-4">{title}</h2>
                    <p className="text-sm mb-4">{contentText}</p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  </div>
);

const FlipCard: React.FC<FlipCardProps> = ({
  frontTitle,
  backTitle,
  frontContentText,
  backContentText,
  frontImageUrl,
  backImageUrl,
}) => {
  const [isFlipped, setIsFlipped] = useState(true);

  const flipCard = () => setIsFlipped(!isFlipped);

  return (
    <div
      className="relative w-52 h-72 cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={flipCard}
    >
      <div
        className="relative w-full h-full transition-transform duration-600"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front Side */}
        <CardSide
          title={frontTitle}
          contentText={frontContentText}
          imageUrl={frontImageUrl}
          showDialog={!!frontContentText}
        />

        {/* Back Side */}
        <div
          className="absolute w-full h-full flex items-center justify-center bg-gray-800 rounded-xl text-white"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <CardSide
            title={backTitle}
            contentText={backContentText}
            imageUrl={backImageUrl}
            isBack={true}
          />
          {!backImageUrl && (
            <DotPattern
              className={cn(
                "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
