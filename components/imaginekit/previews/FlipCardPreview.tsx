"use client";
import React from "react";
import { ImageIcon, StickyNote } from "lucide-react";

interface FlipCardPreviewProps {}

const FlipCardPreview: React.FC<FlipCardPreviewProps> = ({}) => {
  return (
    <div className="grid grid-cols-2 w-52 ">
      <div className="p-0.5  col-span-2">
        <div className="relative bg-gray-50 flex flex-col items-center justify-center h-72 rounded-xl border-2">
          <ImageIcon className="w-12 h-12 text-gray-400" />
          <p className="text-gray-400 text-sm">flip card shows here</p>
        </div>
      </div>
    </div>
  );
};

export default FlipCardPreview;
