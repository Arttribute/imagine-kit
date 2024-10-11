import React from "react";
import { Volume2Icon } from "lucide-react";

interface AudioPlayerPreviewProps {}

const AudioPlayerPreview: React.FC<AudioPlayerPreviewProps> = () => {
  return (
    <div className="flex flex-col rounded-full w-96">
      {/* Static input description */}
      <div className="flex items-center justify-center w-full p-2 pr-8 border rounded-full">
        <div className="p-2 border rounded-full">
          <Volume2Icon className="w-5 h-5 text-gray-700" />
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-lg px-4 m-2 border"></div>
      </div>
    </div>
  );
};

export default AudioPlayerPreview;
