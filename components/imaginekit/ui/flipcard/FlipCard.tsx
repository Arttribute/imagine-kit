"use client";
import React, { useState } from "react";

interface FlipCardProps {
  backTitle?: string;
  frontTitle?: string;
  frontContentText?: string;
  backContentText?: string;
  frontImageUrl?: string;
  backImageUrl?: string;
}

const FlipCard: React.FC<FlipCardProps> = ({
  backTitle,
  frontTitle,
  frontContentText,
  backContentText,
  frontImageUrl,
  backImageUrl,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className="relative w-52 h-72"
      style={{
        perspective: "1000px",
      }}
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
        <div
          className="absolute w-full h-full backface-hidden"
          style={{
            backfaceVisibility: "hidden",
          }}
        >
          <div className="flex flex-col justify-center items-center bg-white rounded-2xl shadow-xl p-1">
            {frontImageUrl && (
              <div className="relative w-full h-full overflow-hidden rounded-xl">
                <img
                  src={frontImageUrl}
                  alt={frontTitle}
                  className="w-full h-full object-cover aspect-[6/9] rounded-xl"
                />
                {frontTitle && (
                  <div className="absolute top-0 right-0 w-full h-15 bg-gray-700 bg-opacity-50 flex justify-center items-center">
                    <h3 className="text-sm text-white font-semibold">
                      {frontTitle}
                    </h3>
                  </div>
                )}
                {frontContentText && (
                  <div className="absolute bottom-2 w-full flex justify-center items-center">
                    <div className="bg-black bg-opacity-50 text-white py-2 px-4 rounded-sm hover:bg-opacity-70">
                      {frontContentText}
                    </div>
                  </div>
                )}
              </div>
            )}
            {!frontImageUrl && (
              <div className="relative w-full h-72 overflow-hidden rounded-xl border ">
                {frontTitle && (
                  <div className="absolute top-0 right-0 w-full h-15 bg-gray-700 bg-opacity-50 flex justify-center items-center">
                    <h3 className="text-sm text-white font-semibold">
                      {frontTitle}
                    </h3>
                  </div>
                )}
                {frontContentText && (
                  <div className="flex flex-col items-center justify-center items-center h-full">
                    <div className="text-gray-600 py-2 px-4 rounded-sm hover:bg-opacity-70 text-center">
                      {frontContentText}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Back Side */}
        <div
          className="absolute w-full h-full flex items-center justify-center bg-gray-800 rounded-xl text-white"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="flex flex-col items-center justify-center h-full">
            {backImageUrl && (
              <div className="relative w-full h-full overflow-hidden rounded-xl">
                <img
                  src={backImageUrl}
                  alt={backTitle}
                  className="w-full h-full object-cover aspect-[6/9] rounded-xl"
                />
                {backTitle && (
                  <div className="absolute top-0 right-0 w-full h-15 bg-gray-700 bg-opacity-50 flex justify-center items-center">
                    <h3 className="text-sm text-white font-semibold">
                      {backTitle}
                    </h3>
                  </div>
                )}
                {backContentText && (
                  <div className="absolute bottom-2 w-full flex justify-center items-center">
                    <div className="bg-black bg-opacity-50 text-white py-2 px-4 rounded-sm hover:bg-opacity-70">
                      {backContentText}
                    </div>
                  </div>
                )}
              </div>
            )}
            {!backImageUrl && (
              <div className="relative w-full h-72 overflow-hidden rounded-xl border ">
                {backTitle && (
                  <div className="absolute top-0 right-0 w-full h-15 bg-gray-700 bg-opacity-50 flex justify-center items-center">
                    <h3 className="text-sm text-white font-semibold">
                      {backTitle}
                    </h3>
                  </div>
                )}
                {backContentText && (
                  <div className="flex flex-col items-center justify-center items-center h-full">
                    <div className="text-gray-600 py-2 px-4 rounded-sm hover:bg-opacity-70 text-center">
                      {backContentText}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
