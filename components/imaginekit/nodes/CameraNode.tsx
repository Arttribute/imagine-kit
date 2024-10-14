import React from "react";
import BaseNode from "@/components/imaginekit/nodes/BaseNode";
import { CameraIcon } from "lucide-react";

interface CameraNodeProps {
  data: {
    cameraName: string;
    outputs: { id: string; label: string; value: string }[];
    onDataChange: (id: string, data: any) => void;
    onRemoveNode: (id: string) => void;
  };
  id: string;
}

const CameraNode: React.FC<CameraNodeProps> = ({ data, id }) => {
  const { cameraName, outputs, onDataChange, onRemoveNode } = data;

  return (
    <BaseNode
      id={id}
      name={cameraName}
      defaultName="Camera"
      nameKey="cameraName"
      type="output"
      outputs={outputs}
      icon={<CameraIcon className="w-5 h-5 text-gray-400" />}
      onDataChange={onDataChange}
      onRemoveNode={onRemoveNode}
    >
      <div className="w-full p-2">
        <div className=" bg-gray-50 flex flex-col items-center justify-center h-64 rounded-xl border-2">
          <CameraIcon className="w-12 h-12 text-gray-400" />
          <p className="text-gray-400 text-sm">Camera display</p>
        </div>
      </div>
    </BaseNode>
  );
};

export default CameraNode;
