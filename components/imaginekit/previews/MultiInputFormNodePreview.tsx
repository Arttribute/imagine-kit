import React from "react";
import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import TextInputPreview from "./TextInputPreview";
import FileUploadPreview from "./FileUploadPreview";
import CameraPreview from "./CameraPreview";
import SketchPadPreview from "./SkethPadPreview";
import AudioRecorderPreview from "./AudioRecorderPreview";
import { KeyboardIcon } from "lucide-react";

interface MultiInputFormPreviewProps {
  fieldTypes: string[];
}

const MultiInputFormPreview: React.FC<MultiInputFormPreviewProps> = ({
  fieldTypes,
}) => {
  return (
    <div className="flex flex-col  border p-2 rounded-xl shadow-lg">
      {/* Form Header */}
      <div className="flex items-center mb-2">
        <ClipboardList className="w-5 h-5 text-gray-400 mr-2" />
        <p className="text-gray-400 text-sm">Multi Input Form Preview</p>
      </div>
      {/* Input Previews */}
      <div className="space-y-2">
        {fieldTypes &&
          fieldTypes.map((fieldType) => {
            switch (fieldType) {
              case "text":
                return (
                  <div
                    className="relative bg-gray-50 flex rounded-lg border-2 p-2"
                    key={fieldType}
                  >
                    <KeyboardIcon className="w-5 h-5 text-gray-400 mr-2" />
                    <p className="text-gray-400 text-sm">User input here</p>
                  </div>
                );
              case "file":
                return <FileUploadPreview key={fieldType} />;
              case "camera":
                return <CameraPreview key={fieldType} />;
              case "sketchpad":
                return <SketchPadPreview key={fieldType} />;
              case "audio":
                return <AudioRecorderPreview key={fieldType} />;
              // Add more cases if needed
              default:
                return null;
            }
          })}
      </div>
      <Button className="mt-2">Submit</Button>
    </div>
  );
};

export default MultiInputFormPreview;
