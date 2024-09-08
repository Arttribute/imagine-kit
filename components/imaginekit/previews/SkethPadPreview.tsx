import React from "react";
import { PencilLine, Pencil, Eraser, Undo, Redo } from "lucide-react";

interface SketchPadPreviewProps {}

const SketchPadPreview: React.FC<SketchPadPreviewProps> = ({}) => {
  return (
    <div className="p-1 w-72">
      <div className="flex items-center justify-center">
        <div className=" flex items-center justify-center bg-gray-100 rounded-lg p-1 m-2 border w-32 -mb-3">
          <Pencil className="h-4 w-4 text-gray-400 mr-1.5" />
          <Eraser className="h-4 w-4 text-gray-400 mr-1.5" />
          <Undo className="h-4 w-4 text-gray-400 mr-1.5" />
          <Redo className="h-4 w-4 text-gray-400" />
        </div>
      </div>
      <div className="bg-gray-50 flex flex-col items-center justify-center h-64 rounded-xl border-2">
        <PencilLine className="w-12 h-12 text-gray-400" />
        <p className="text-gray-400 text-sm">User sketch here</p>
      </div>
    </div>
  );
};

export default SketchPadPreview;
