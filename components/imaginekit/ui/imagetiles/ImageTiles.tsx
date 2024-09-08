"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import axios from "axios";
interface Props {
  src: string;
  numCols: number;
}

const ImageTiles: React.FC<Props> = ({ src, numCols }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pieces, setPieces] = useState<{ id: number; img: string }[]>([]);
  const [shuffledPositions, setShuffledPositions] = useState<number[]>([]);
  const [movesTaken, setMovesTaken] = useState(0);
  const [puzzleIsComplete, setPuzzleIsComplete] = useState(false);
  const [failedPuzzle, setFailedPuzzle] = useState(false);

  const numRows = numCols;
  const router = useRouter();

  useEffect(() => {
    const fetchImage = async (url: string) => {
      //uplaod image to cloudinary
      const data = new FormData();
      data.append("file", url);
      data.append("upload_preset", "studio-upload");
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/arttribute/upload",
        data
      );
      const response = await fetch(res.data.secure_url);

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    };

    const processImage = (dataUrl: string) => {
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

        URL.revokeObjectURL(dataUrl);
      };
    };

    fetchImage(src).then(processImage);

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

  return (
    <div>
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
          <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-80 flex justify-center items-center">
            <div className="bg-white border m-2 shadow-lg p-0.5 rounded-xl">
              <div className="border flex-col justify-center items-center rounded-xl p-2">
                <p className="text-center m-2">
                  Congratulations! You solved the puzzle in {movesTaken} moves.
                </p>
                <Button onClick={() => router.refresh()} className="w-full">
                  Play Again
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageTiles;
