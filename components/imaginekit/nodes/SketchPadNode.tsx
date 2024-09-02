import React from "react";
import { PencilLine } from "lucide-react";
import BaseNode from "@/components/imaginekit/nodes/BaseNode";
import { Pencil, Eraser, Undo, Redo } from "lucide-react";

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
        <div className="flex items-center justify-center">
          <div className=" flex items-center justify-center bg-gray-100 rounded-lg p-1 m-2 border w-32 -mb-3">
            <Pencil className="h-4 w-4 text-gray-400 mr-1.5" />
            <Eraser className="h-4 w-4 text-gray-400 mr-1.5" />
            <Undo className="h-4 w-4 text-gray-400 mr-1.5" />
            <Redo className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className=" bg-gray-50 flex flex-col items-center justify-center h-64 rounded-xl border-2">
          <PencilLine className="w-12 h-12 text-gray-400" />
          <p className="text-gray-400 text-sm">User sketch here</p>
        </div>
      </div>
    </BaseNode>
  );
};

export default SketchPadNode;
