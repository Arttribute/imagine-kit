import React from "react";
import { CloudUploadIcon, ArrowUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
interface FileUploadPreviewProps {}

const FileUploadPreview: React.FC<FileUploadPreviewProps> = () => {
  return (
    <div className="flex flex-col rounded-full w-96">
      {/* Static input description */}
      <div className="flex items-center justify-center  w-full p-2  border rounded-lg">
        <div className="flex w-full border border-dashed border-gray-500  p-1 rounded-lg mr-2">
          <div className="flex items-center justify-center border border-gray-600 text-gray-600 px-4 py-1.5 rounded-lg">
            <CloudUploadIcon className="w-5 h-5 mr-1 text-gray-600" />
            <p className="text-xs">Upload file</p>
          </div>
        </div>
        <Button className="m-1 p-3 rounded-xl ml-auto">
          <ArrowUpIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FileUploadPreview;
