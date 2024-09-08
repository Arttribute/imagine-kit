import React from "react";
import { TypeOutlineIcon, AlignLeftIcon } from "lucide-react";
import BaseNode from "@/components/imaginekit/nodes/BaseNode";

interface TextOutputNodeProps {
  data: {
    textOutputName: string; // Name of the TextOutputNode node
    inputs: { id: string; label: string; value: string }[]; // Inputs for the node
    onDataChange: (id: string, data: any) => void;
    onRemoveNode: (id: string) => void;
  };
  id: string;
}

const TextOutputNode: React.FC<TextOutputNodeProps> = ({ data, id }) => {
  const { textOutputName, inputs, onDataChange, onRemoveNode } = data;

  return (
    <BaseNode
      id={id}
      name={textOutputName}
      defaultName="Text Output"
      nameKey="textOutputName"
      type="input"
      inputs={inputs}
      icon={<AlignLeftIcon className="w-5 h-5 text-gray-400" />}
      onDataChange={onDataChange}
      onRemoveNode={onRemoveNode}
    >
      <div className="w-full">
        <div className="relative bg-gray-50 flex rounded-lg border-2 p-2">
          <TypeOutlineIcon className="w-5 h-5 text-gray-400 mr-2" />
          <AlignLeftIcon className="w-5 h-5 text-gray-400 mr-2" />
          <p className="text-gray-400 text-sm">Text output shows here</p>
        </div>
      </div>
    </BaseNode>
  );
};

export default TextOutputNode;
