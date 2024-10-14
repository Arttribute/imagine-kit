import React from "react";
import { CameraIcon, ArrowUpIcon, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraPreviewProps {}

const CameraPreview: React.FC<CameraPreviewProps> = ({}) => {
  return (
    <div className="p-1 h-96 w-96 ">
      <div className="bg-gray-50 flex flex-col items-center justify-center h-72 rounded-xl border-2">
        <CameraIcon className="w-12 h-12 text-gray-400" />
        <p className="text-gray-400 text-sm">Photo here</p>
      </div>
      <div className="flex items-center justify-center">
        <div className="flex-none items-center justify-center">
          <div className="p-1 border rounded-lg">
            <div className="p-2 border rounded-md">
              <ImageIcon className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
        <div className="grow flex justify-center items-center">
          <div className="p-1 mt-2 border rounded-full shadow-md hover:bg-gray-50">
            <div className="p-3 border border-gray-200 rounded-full">
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
  );
};

export default CameraPreview;
