import React from "react";
import { TypeOutlineIcon, AlignLeftIcon } from "lucide-react";
import BaseNode from "@/components/BaseNode";

interface TextOutputPreviewProps {}

const TextOutputPreview: React.FC<TextOutputPreviewProps> = ({}) => {
  return (
    <div className="w-80">
      <div className="relative bg-gray-50 flex rounded-lg border-2 p-2">
        <TypeOutlineIcon className="w-5 h-5 text-gray-400 mr-2" />
        <AlignLeftIcon className="w-5 h-5 text-gray-400 mr-2" />
        <p className="text-gray-400 text-sm">Text output shows here</p>
      </div>
    </div>
  );
};

export default TextOutputPreview;
