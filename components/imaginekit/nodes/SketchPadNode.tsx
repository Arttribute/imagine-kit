import React from "react";
import { PencilLine } from "lucide-react";
import BaseNode from "@/components/BaseNode"; // Import BaseNode

interface SketchPadNodeProps {
  data: {
    sketchName: string;
    outputs: { id: string; label: string; value: string }[];
    onDataChange: (id: string, data: any) => void;
    onRemoveNode: (id: string) => void;
  };
  id: string;
}

const SketchPadNode: React.FC<SketchPadNodeProps> = ({ data, id }) => {
  const { sketchName, outputs, onDataChange, onRemoveNode } = data;

  return (
    <BaseNode
      id={id}
      name={sketchName}
      defaultName="Sketch Pad"
      nameKey="sketchName"
      type="output"
      outputs={outputs}
      icon={<PencilLine className="w-5 h-5 text-gray-400" />}
      onDataChange={onDataChange}
      onRemoveNode={onRemoveNode}
    >
      <div className="w-full p-2">
        <div className="relative bg-gray-50 flex flex-col items-center justify-center h-64 rounded-xl border-2">
          <PencilLine className="w-12 h-12 text-gray-400" />
          <p className="text-gray-400 text-sm">User sketch here</p>
        </div>
      </div>
    </BaseNode>
  );
};

export default SketchPadNode;
