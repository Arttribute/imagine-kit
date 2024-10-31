"use client";
import React from "react";
import { ImageIcon, StickyNote } from "lucide-react";
import BaseNode from "@/components/imaginekit/nodes/BaseNode";

interface FlipCardNodeProps {
  data: {
    flipCardName: string; // Name of the FlipCardNode node
    inputs: { id: string; label: string; value: string }[]; // Inputs for the node
    onDataChange: (id: string, data: any) => void;
    onRemoveNode: (id: string) => void;
  };
  id: string;
}

const FlipCardNode: React.FC<FlipCardNodeProps> = ({ data, id }) => {
  const { flipCardName, inputs, onDataChange, onRemoveNode } = data;

  return (
    <BaseNode
      id={id}
      name={flipCardName}
      defaultName="Flip Card"
      nameKey="flipCardName"
      type="input"
      inputs={inputs}
      inputPlaceholders={[
        "Front title",
        "Back title",
        "Front text",
        "Back text",
        "Front image",
        "Back image",
      ]}
      icon={
        <div className="flex items-center">
          <StickyNote className="w-4 h-4 text-gray-400 mr-1" />
          <p className="text-xs text-gray-500">Flip card</p>
        </div>
      }
      onDataChange={onDataChange}
      onRemoveNode={onRemoveNode}
    >
      <div className="grid grid-cols-2">
        <div
          className={`p-0.5 ${
            inputs.length === 1 ? "col-span-2" : "col-span-1"
          }`}
        >
          <div className="relative bg-gray-50 flex flex-col items-center justify-center h-64 rounded-xl border-2">
            <ImageIcon className="w-12 h-12 text-gray-400" />
            <p className="text-gray-400 text-sm">flip card shows here</p>
          </div>
        </div>
      </div>
    </BaseNode>
  );
};

export default FlipCardNode;
