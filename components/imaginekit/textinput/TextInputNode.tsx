import React from "react";
import { KeyboardIcon } from "lucide-react";
import BaseNode from "@/components/BaseNode";

interface TextInputNodeProps {
  data: {
    textInputName: string;
    outputs: { id: string; label: string; value: string }[];
    onDataChange: (id: string, data: any) => void;
    onRemoveNode: (id: string) => void;
  };
  id: string;
}

const TextInputNode: React.FC<TextInputNodeProps> = ({ data, id }) => {
  const { textInputName, outputs, onDataChange, onRemoveNode } = data;

  return (
    <BaseNode
      id={id}
      name={textInputName || "Text Input"}
      type="output"
      outputs={outputs}
      icon={<KeyboardIcon className="w-5 h-5 text-gray-400" />}
      onDataChange={onDataChange}
      onRemoveNode={onRemoveNode}
    >
      <div className="w-full">
        <div className="relative bg-gray-50 flex rounded-lg border-2 p-2">
          <KeyboardIcon className="w-5 h-5 text-gray-400 mr-2" />
          <p className="text-gray-400 text-sm">User input here</p>
        </div>
      </div>
    </BaseNode>
  );
};

export default TextInputNode;
