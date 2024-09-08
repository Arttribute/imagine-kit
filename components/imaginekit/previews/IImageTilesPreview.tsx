"use client";
import React from "react";
import { ImageIcon } from "lucide-react";

interface ImageTilesPreviewProps {}

// Component to render a single image tile
const ImageTile: React.FC = () => (
  <div className="p-0.5 col-span-1">
    <div className="relative bg-gray-50 flex flex-col items-center justify-center h-24 rounded-xl border-2">
      <ImageIcon className="w-12 h-12 text-gray-400" />
    </div>
  </div>
);

const ImageTilesPreview: React.FC<ImageTilesPreviewProps> = ({}) => {
  // Number of image tiles to display
  const imageTileCount = 9;

  return (
    <div className="grid grid-cols-3 w-80">
      {Array.from({ length: imageTileCount }).map((_, index) => (
        <ImageTile key={index} />
      ))}
    </div>
  );
};

export default ImageTilesPreview;
