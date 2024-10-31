"use client";
import React from "react";
import {
  FileIcon,
  PaperclipIcon,
  CloudUploadIcon,
  ArrowUpIcon,
} from "lucide-react";
import BaseNode from "@/components/imaginekit/nodes/BaseNode";

interface FileUploadNodeProps {
  data: {
    fileUploadName: string; // Name of the FileUpload node
    outputs: { id: string; label: string; value: string }[]; // outputs for the node
    onDataChange: (id: string, data: any) => void;
    onRemoveNode: (id: string) => void;
  };
  id: string;
}

const FileUploadNode: React.FC<FileUploadNodeProps> = ({ data, id }) => {
  const { fileUploadName, outputs, onDataChange, onRemoveNode } = data;

  return (
    <BaseNode
      id={id}
      name={fileUploadName}
      defaultName="File Upload"
      nameKey="fileUploadName"
      type="output"
      outputs={outputs}
      outputPlaceholders={["File"]}
      icon={<FileIcon className="w-5 h-5 text-gray-400" />}
      onDataChange={onDataChange}
      onRemoveNode={onRemoveNode}
    >
      {/* Display Images */}

      <div className="flex items-center justify-center bg-gray-50 w-full p-2  border rounded-lg">
        <div className="p-2">
          <PaperclipIcon className="w-5 h-5 text-gray-400" />
        </div>
        <div className="flex w-full border border-dashed border-gray-300  p-1 rounded-lg">
          <div className="flex items-center justify-center border border-gray-400 text-gray-400 px-4 py-1.5 rounded-lg">
            <CloudUploadIcon className="w-5 h-5 mr-1 text-gray-400" />
            <p className="text-xs">Upload file</p>
          </div>
        </div>
        <div className="flex items-center justify-center border border-gray-400 rounded-lg w-9 h-9 ml-2 p-2">
          <ArrowUpIcon className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </BaseNode>
  );
};

export default FileUploadNode;
