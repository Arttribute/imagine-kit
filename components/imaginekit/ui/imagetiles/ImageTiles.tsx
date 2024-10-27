"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Confetti from "@/components/magicui/confetti";
import type { ConfettiRef } from "@/components/magicui/confetti";
import ImageTilesPreview from "@/components/imaginekit/previews/IImageTilesPreview";
import { Button } from "@/components/ui/button";
import {
  getImageBlob,
  getImageBase64,
  base64ToBlob,
} from "@/utils/imageProcesing";

import ky from "ky";
import { set } from "lodash";
import { reset } from "canvas-confetti";

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
interface Props {
  src: string;
  numCols: number;
  loading?: boolean;
}

const ImageTiles: React.FC<Props> = ({ src, numCols, loading }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pieces, setPieces] = useState<{ id: number; img: string }[]>([]);
  const [shuffledPositions, setShuffledPositions] = useState<number[]>([]);
  const [movesTaken, setMovesTaken] = useState(0);
  const [puzzleIsComplete, setPuzzleIsComplete] = useState(false);
  const [failedPuzzle, setFailedPuzzle] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  const numRows = numCols;
  const router = useRouter();
  const confettiRef = useRef<ConfettiRef>(null);

  useEffect(() => {
    const fetchImage = async (url: string) => {
      setLoadingImage(true);
      if (!isValidUrl(url)) {
        console.error("Invalid URL");
        return;
      }

      //get base64 image
      const base64 = await getImageBase64(url);
      console.log("base64", base64);
      //convert base64 to blob
      const blob = base64ToBlob(base64, "image/png");
      setLoadingImage(false);
      return URL.createObjectURL(blob);
    };

    const processImage = (dataUrl: string) => {
      setLoadingImage(true);
      const image = new Image();
      image.src = dataUrl;

      image.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        const pieceWidth = Math.floor(image.width / numCols);
        const pieceHeight = Math.floor(image.height / numRows);

        const tempPieces: { id: number; img: string }[] = [];
        const tempPositions: number[] = [];

        for (let row = 0; row < numRows; row++) {
          for (let col = 0; col < numCols; col++) {
            const piece = ctx.getImageData(
              col * pieceWidth,
              row * pieceHeight,
              pieceWidth,
              pieceHeight
            );
            const pieceCanvas = document.createElement("canvas");
            pieceCanvas.width = pieceWidth;
            pieceCanvas.height = pieceHeight;
            const pieceCtx = pieceCanvas.getContext("2d");
            pieceCtx?.putImageData(piece, 0, 0);

            tempPieces.push({
              id: row * numCols + col,
              img: pieceCanvas.toDataURL(),
            });
            tempPositions.push(row * numCols + col);
          }
        }

        setPieces(tempPieces);

        for (let i = tempPositions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [tempPositions[i], tempPositions[j]] = [
            tempPositions[j],
            tempPositions[i],
          ];
        }
        setShuffledPositions(tempPositions);
        setLoadingImage(false);
        URL.revokeObjectURL(dataUrl);
      };
    };

    fetchImage(src).then((dataUrl) => {
      if (dataUrl) {
        processImage(dataUrl);
      } else {
        console.error("Failed to fetch image");
      }
    });

    console.log("puzzle pieces", pieces);
  }, [src]);

  const handleDragStart = (event: React.DragEvent, id: number) => {
    event.dataTransfer.setData("text/plain", id.toString());
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const sourceId = parseInt(event.dataTransfer.getData("text/plain"));
    const targetId = parseInt(event.currentTarget.id);
    if (sourceId !== targetId) {
      const newPositions = [...shuffledPositions];
      const sourceIndex = newPositions.indexOf(sourceId);
      const targetIndex = newPositions.indexOf(targetId);
      [newPositions[sourceIndex], newPositions[targetIndex]] = [
        newPositions[targetIndex],
        newPositions[sourceIndex],
      ];
      setShuffledPositions(newPositions);
      setMovesTaken((prev: number) => prev + 1);
      checkCompletion(newPositions);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const checkCompletion = (positions: number[]) => {
    for (let i = 0; i < positions.length; i++) {
      if (positions[i] !== i) {
        setPuzzleIsComplete(false);
        return;
      }
    }
    setPuzzleIsComplete(true);
  };

  const resetPuzzle = () => {
    setMovesTaken(0);
    setPuzzleIsComplete(false);
    setFailedPuzzle(false);
    const tempPositions = [...shuffledPositions];
    for (let i = tempPositions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tempPositions[i], tempPositions[j]] = [
        tempPositions[j],
        tempPositions[i],
      ];
    }
    setShuffledPositions(tempPositions);
  };

  return (
    <div>
      {loading && loadingImage && (
        <div className="col-span-2 p-2 h-96  w-96 p-1">
          <div className="bg-gray-100 h-full rounded-xl p-1">
            <div className="flex flex-col items-center justify-center ">
              <Loader2 className="w-8 h-8 animate-spin text-gray-700 mt-40" />
            </div>
          </div>
        </div>
      )}
      {loading && !loadingImage && (
        <div className="col-span-2 p-2 h-96  w-96 p-1">
          <div className="bg-gray-100 h-full rounded-xl p-1">
            <div className="flex flex-col items-center justify-center ">
              <Loader2 className="w-8 h-8 animate-spin text-gray-700 mt-40" />
            </div>
          </div>
        </div>
      )}
      {!loading && !isValidUrl(src) && (
        <div>
          <ImageTilesPreview />
        </div>
      )}
      {!loading && (
        <div className="w-96 h-96 relative">
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <div className={`grid grid-cols-${numCols}`}>
            {shuffledPositions.map((position, index) => (
              <img
                key={index}
                id={pieces[position].id.toString()}
                src={pieces[position].img}
                draggable="true"
                onDragStart={(e) => handleDragStart(e, pieces[position].id)}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="p-[0.8px] col-span-1 rounded-md cursor-pointer hover:shadow-2xl transition duration-200 ease-in-out"
              />
            ))}
          </div>
          {puzzleIsComplete && (
            <div className="absolute top-0 left-0 w-full h-full bg-gray-700 rounded-sm  bg-opacity-80 flex justify-center items-center">
              <div className="z-10 bg-white border border-indigo-300 m-2 shadow-lg p-0.5 rounded-xl">
                <div className=" border border-gray-400 flex-col justify-center items-center rounded-xl p-4">
                  <h3 className="text-center text-lg font-semibold">
                    Congratulations! 🎉
                  </h3>
                  <p className="text-sm text-center mx-2 mb-2">
                    You solved the puzzle in {movesTaken} moves.
                  </p>

                  <Button
                    onClick={resetPuzzle}
                    className="w-full  bg-indigo-700 hover:bg-indigo-600 rounded-lg"
                  >
                    Play Again
                  </Button>
                </div>
              </div>
              <Confetti
                ref={confettiRef}
                className="absolute left-0 top-0 z-0 size-full"
                onMouseEnter={() => {
                  confettiRef.current?.fire({
                    particleCount: 250,
                    spread: 80,
                  });
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageTiles;
