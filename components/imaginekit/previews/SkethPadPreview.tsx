import React from "react";
import { PencilLine, Pencil, Eraser, Undo, Redo } from "lucide-react";

interface SketchPadPreviewProps {}

const SketchPadPreview: React.FC<SketchPadPreviewProps> = ({}) => {
  return (
    <div className="p-1  w-96 ">
      <div className="flex items-center justify-center">
        <div className=" flex items-center justify-center bg-gray-100 rounded-lg px-4 py-3 m-2 border w-44 ">
          <Pencil className="h-5 w-5 text-gray-400 mr-3" />
          <Eraser className="h-5 w-5 text-gray-400 mr-3" />
          <Undo className="h-5 w-5 text-gray-400 mr-3" />
          <Redo className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      <div className="bg-gray-50 flex flex-col items-center justify-center h-[50vh] rounded-xl border-2">
        <PencilLine className="w-12 h-12 text-gray-400" />
        <p className="text-gray-400 text-sm">User sketch here</p>
      </div>
    </div>
  );
};

export default SketchPadPreview;
