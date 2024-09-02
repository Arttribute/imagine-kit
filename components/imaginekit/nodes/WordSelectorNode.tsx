"use client";
import React from "react";
import { MousePointer, TypeOutlineIcon } from "lucide-react";
import BaseNode from "@/components/imaginekit/nodes/BaseNode";

interface WordSelectorNodeProps {
  data: {
    WordSelectorName: string; // Name of the WordSelectorNode node
    inputs: { id: string; label: string; value: string }[]; // Inputs for the node
    outputs: { id: string; label: string; value: string }[]; // Outputs for the node
    onDataChange: (id: string, data: any) => void;
    onRemoveNode: (id: string) => void;
  };
  id: string;
}

const WordSelectorNode: React.FC<WordSelectorNodeProps> = ({ data, id }) => {
  const { WordSelectorName, inputs, outputs, onDataChange, onRemoveNode } =
    data;

  return (
    <BaseNode
      id={id}
      name={WordSelectorName}
      defaultName="Word Selector"
      nameKey="WordSelectorName"
      type="both"
      inputs={inputs}
      outputs={outputs}
      icon={
        <div className="flex items-center">
          <MousePointer className="w-4 h-4 text-gray-400 mr-1" />
          <p className="text-xs text-gray-500">Select</p>
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

export default WordSelectorNode;
