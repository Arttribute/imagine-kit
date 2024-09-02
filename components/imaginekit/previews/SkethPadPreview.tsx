import React from "react";
import { PencilLine } from "lucide-react";

interface SketchPadPreviewProps {}

const SketchPadPreview: React.FC<SketchPadPreviewProps> = ({}) => {
  return (
    <div className="border p-2 roundec-3xl bg-blue-100 p-2">
      <div className="w-full p-2">
        <div className="relative bg-gray-50 flex flex-col items-center justify-center h-64 rounded-xl border-2">
          <PencilLine className="w-12 h-12 text-gray-400" />
          <p className="text-gray-400 text-sm">User sketch here</p>
        </div>
      </div>
    </div>
  );
};

export default SketchPadPreview;
