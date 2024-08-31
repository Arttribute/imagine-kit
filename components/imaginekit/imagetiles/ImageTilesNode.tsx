"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { ImageIcon, LayoutGridIcon } from "lucide-react";
import BaseNode from "@/components/BaseNode";

interface ImageTilesNodeProps {
  data: {
    imageTilesName: string; // Name of the ImageTilesNode node
    inputs: { id: string; label: string; value: string }[]; // Inputs for the node
    outputs: { id: string; label: string; value: string }[]; // Outputs for the node
    onDataChange: (id: string, data: any) => void;
    onRemoveNode: (id: string) => void;
  };
  id: string;
}

// Component to render a single image tile
const ImageTile: React.FC = () => (
  <div className="p-0.5 col-span-1">
    <div className="relative bg-gray-50 flex flex-col items-center justify-center h-24 rounded-xl border-2">
      <ImageIcon className="w-12 h-12 text-gray-400" />
    </div>
  </div>
);

const ImageTilesNode: React.FC<ImageTilesNodeProps> = ({ data, id }) => {
  const { imageTilesName, inputs, outputs, onDataChange, onRemoveNode } = data;

  // Number of image tiles to display
  const imageTileCount = 9;

  return (
    <BaseNode
      id={id}
      name={imageTilesName || "Image Tiles"}
      type="both"
      inputs={inputs}
      outputs={outputs}
      icon={
        <div className="flex items-center">
          <LayoutGridIcon className="w-4 h-4 text-gray-400 mr-1" />
          <p className="text-xs text-gray-500">Tiles</p>
        </div>
      }
      onDataChange={onDataChange}
      onRemoveNode={onRemoveNode}
    >
      <div className="grid grid-cols-3">
        {Array.from({ length: imageTileCount }).map((_, index) => (
          <ImageTile key={index} />
        ))}
      </div>
    </BaseNode>
  );
};

export default ImageTilesNode;
