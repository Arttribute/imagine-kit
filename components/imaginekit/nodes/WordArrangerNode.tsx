"use client";
import React from "react";
import { MousePointer, TypeOutlineIcon, Shuffle } from "lucide-react";
import BaseNode from "@/components/BaseNode";

interface WordArrangerNodeProps {
  data: {
    WordArrangerName: string; // Name of the WordArrangerNode node
    inputs: { id: string; label: string; value: string }[]; // Inputs for the node
    outputs: { id: string; label: string; value: string }[]; // Outputs for the node
    onDataChange: (id: string, data: any) => void;
    onRemoveNode: (id: string) => void;
  };
  id: string;
}

const WordArrangerNode: React.FC<WordArrangerNodeProps> = ({ data, id }) => {
  const { WordArrangerName, inputs, outputs, onDataChange, onRemoveNode } =
    data;

  return (
    <BaseNode
      id={id}
      name={WordArrangerName}
      defaultName="Word Arranger"
      nameKey="WordArrangerName"
      type="both"
      inputs={inputs}
      outputs={outputs}
      icon={
        <div className="flex items-center">
          <Shuffle className="w-4 h-4 text-gray-400 mr-1" />
          <p className="text-xs text-gray-500">Arrange</p>
        </div>
      }
      onDataChange={onDataChange}
      onRemoveNode={onRemoveNode}
    >
      <div className="w-full">
        <div className="grid grid-cols-4">
          <div className="col-span-1 bg-gray-50 flex rounded-lg border-2 m-1 p-2">
            <TypeOutlineIcon className="w-5 h-5 text-gray-400 mr-2" />
            <p className="text-gray-400 text-sm">word</p>
          </div>
          <div className="col-span-1 bg-gray-50 flex rounded-lg border-2 m-1 p-2">
            <TypeOutlineIcon className="w-5 h-5 text-gray-400 mr-2" />
            <p className="text-gray-400 text-sm">word</p>
          </div>
          <div className="col-span-1 bg-gray-50 flex rounded-lg border-2 m-1 p-2">
            <TypeOutlineIcon className="w-5 h-5 text-gray-400 mr-2" />
            <p className="text-gray-400 text-sm">word</p>
          </div>
          <div className="col-span-1 bg-gray-50 flex rounded-lg border-2 m-1 p-2">
            <TypeOutlineIcon className="w-5 h-5 text-gray-400 mr-2" />
            <p className="text-gray-400 text-sm">word</p>
          </div>
        </div>
      </div>
    </BaseNode>
  );
};

export default WordArrangerNode;
