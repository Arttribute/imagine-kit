"use client";
import React from "react";
import { ImageIcon } from "lucide-react";

interface ImagesDisplayPreviewProps {}

const ImagesDisplayPreview: React.FC<ImagesDisplayPreviewProps> = ({}) => {
  return (
    <div className="w-72">
      <div className="grid grid-cols-2">
        <div className="p-0.5 col-span-2">
          <div className="relative bg-gray-50 flex flex-col items-center justify-center h-64 rounded-xl border-2">
            <ImageIcon className="w-12 h-12 text-gray-400" />
            <p className="text-gray-400 text-sm">image shows here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagesDisplayPreview;
