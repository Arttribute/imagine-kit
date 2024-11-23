import React from "react";
import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MultiInputFormPreviewProps {}

const MultiInputFormPreview: React.FC<MultiInputFormPreviewProps> = () => {
  return (
    <div className="flex flex-col w-96 border p-2 rounded-xl shadow-lg">
      {/* Form Header */}
      <div className="flex items-center mb-2">
        <ClipboardList className="w-5 h-5 text-gray-400 mr-2" />
        <p className="text-gray-400 text-sm">Multi Input Form</p>
      </div>
      {/* Placeholder Fields */}
      <div className="space-y-2">
        <div className="relative bg-gray-50 flex rounded-lg border p-2">
          <p className="text-gray-400 text-sm">Text Input Field</p>
        </div>
        <div className="relative bg-gray-50 flex rounded-lg border p-2">
          <p className="text-gray-400 text-sm">File Upload Field</p>
        </div>
        <div className="relative bg-gray-50 flex rounded-lg border p-2">
          <p className="text-gray-400 text-sm">Camera Field</p>
        </div>
        {/* Add more placeholder fields as needed */}
      </div>
      <Button className="mt-2">Submit</Button>
    </div>
  );
};

export default MultiInputFormPreview;
