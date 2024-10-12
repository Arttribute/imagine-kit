import React from "react";
import { MicIcon } from "lucide-react";

interface AudioRecorderPreviewProps {}

const AudioRecorderPreview: React.FC<AudioRecorderPreviewProps> = () => {
  return (
    <div className="flex flex-col rounded-full w-96">
      {/* Static input description */}
      <div className="flex flex-col items-center justify-center w-full p-2 space-y-3 border rounded-3xl">
        <div className="w-full">
          <div className="flex bg-gray-100 rounded-full p-4 w-full">
            <div className="flex justify-center items-center w-full">
              <MicIcon className="h-4 w-4 text-gray-300 mr-1" />
              <p className="text-xs text-gray-400">Start recording</p>
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-full">
          <MicIcon className="w-5 h-5 text-gray-700" />
        </div>
      </div>
    </div>
  );
};

export default AudioRecorderPreview;
