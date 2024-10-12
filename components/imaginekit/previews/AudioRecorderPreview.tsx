import React from "react";
import { MicIcon } from "lucide-react";

interface AudioRecorderPreviewProps {}

const AudioRecorderPreview: React.FC<AudioRecorderPreviewProps> = () => {
  return (
    <div className="flex flex-col rounded-full w-96">
      {/* Static input description */}
      <div className="flex items-center justify-center w-full p-2 pr-8 border rounded-full">
        <div className="p-2 border rounded-full">
          <MicIcon className="w-5 h-5 text-gray-700" />
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-lg px-4 m-2 border"></div>
      </div>
    </div>
  );
};

export default AudioRecorderPreview;
