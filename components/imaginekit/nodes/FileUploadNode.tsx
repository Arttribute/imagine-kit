"use client";
import React from "react";
import { FileIcon } from "lucide-react";
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
      icon={<FileIcon className="w-5 h-5 text-gray-400" />}
      onDataChange={onDataChange}
      onRemoveNode={onRemoveNode}
    >
      {/* Display Images */}

      <div className="flex items-center justify-center bg-gray-50 w-full p-2 pr-8 border rounded-full">
        <div className="p-2 border rounded-full">
          <FileIcon className="w-5 h-5 text-gray-700" />
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-lg px-4 m-2 border"></div>
      </div>
    </BaseNode>
  );
};

export default FileUploadNode;
