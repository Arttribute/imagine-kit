import React from "react";
import { KeyboardIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TextInputPreviewProps {}

const TextInputPreview: React.FC<TextInputPreviewProps> = () => {
  return (
    <div className="flex flex-col w-96">
      {/* Static input description */}
      <div className="relative bg-gray-50 flex rounded-lg border-2 p-2">
        <KeyboardIcon className="w-5 h-5 text-gray-400 mr-2" />
        <p className="text-gray-400 text-sm">User input here</p>
      </div>
      <Button className="mt-1">Submit</Button>
    </div>
  );
};

export default TextInputPreview;
