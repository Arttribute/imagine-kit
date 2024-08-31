"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { ImageIcon, Trash2 } from "lucide-react";
import BaseNode from "@/components/BaseNode";

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
      name={flipCardName || "Flip Card"}
      type="input"
      inputs={inputs}
      icon={<ImageIcon className="w-5 h-5 text-gray-400" />}
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
