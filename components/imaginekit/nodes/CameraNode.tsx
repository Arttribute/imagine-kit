import React from "react";
import BaseNode from "@/components/imaginekit/nodes/BaseNode";
import { CameraIcon, ImageIcon, ArrowUpIcon } from "lucide-react";

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
      outputPlaceholders={["Photo"]}
      icon={<CameraIcon className="w-5 h-5 text-gray-400" />}
      onDataChange={onDataChange}
      onRemoveNode={onRemoveNode}
    >
      <div className="w-full border p-2 rounded-xl">
        <div className="bg-gray-50 flex flex-col items-center justify-center h-64 rounded-xl border-2">
          <CameraIcon className="w-12 h-12 text-gray-400" />
          <p className="text-gray-400 text-sm">Photo here</p>
        </div>
        <div className="flex items-center justify-center mt-1">
          <div className="flex-none items-center justify-center">
            <div className="p-1 border rounded-lg">
              <div className="p-2 border rounded-md">
                <ImageIcon className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
          <div className="grow flex justify-center items-center">
            <div className="p-1 mt-2 border rounded-full shadow-md hover:bg-gray-50">
              <div className="p-2 border border-gray-200 rounded-full">
                <CameraIcon className="w-5 h-5 text-gray-700" />
              </div>
            </div>
          </div>
          <div className="flex-none items-center justify-center">
            <div className="p-4 border rounded-xl">
              <ArrowUpIcon className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </BaseNode>
  );
};

export default CameraNode;
