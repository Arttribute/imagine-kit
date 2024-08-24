"use client";
import React, { useState } from "react";

interface FlipCardProps {}

const FlipCard: React.FC<FlipCardProps> = ({}) => {
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
        <div
          className="absolute w-full h-full backface-hidden"
          style={{
            backfaceVisibility: "hidden",
          }}
        >
          <div className="flex flex-col justify-center items-center bg-white rounded-2xl shadow-xl p-1">
            <div className="relative w-full h-full overflow-hidden rounded-xl">
              <img
                src={"imageUrl"}
                alt={"frontTitle"}
                className="w-full h-full object-cover aspect-[6/9] rounded-xl"
              />
              <div className="absolute top-0 right-0 w-full h-15 bg-gray-700 bg-opacity-50 flex justify-center items-center">
                <h3 className="text-sm text-white font-semibold">
                  {"frontTitle"}
                </h3>
              </div>
              <div className="absolute bottom-2 w-full flex justify-center items-center">
                <button
                  className="bg-black bg-opacity-50 text-white py-2 px-4 rounded-sm hover:bg-opacity-70"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {"buttonText"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="absolute w-full h-full flex items-center justify-center bg-gray-800 rounded-xl text-white"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-3xl font-semibold">{"backTitle"}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
