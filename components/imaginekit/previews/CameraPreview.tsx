import React from "react";
import { CameraIcon } from "lucide-react";

interface CameraPreviewProps {}

const CameraPreview: React.FC<CameraPreviewProps> = ({}) => {
  return (
    <div className="p-1 h-96 w-96 ">
      <div className="bg-gray-50 flex flex-col items-center justify-center h-full rounded-xl border-2">
        <CameraIcon className="w-12 h-12 text-gray-400" />
        <p className="text-gray-400 text-sm">Photo here</p>
      </div>
    </div>
  );
};

export default CameraPreview;
