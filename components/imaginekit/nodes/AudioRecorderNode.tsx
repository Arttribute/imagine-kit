"use client";
import React from "react";
import { MicIcon } from "lucide-react";
import BaseNode from "@/components/imaginekit/nodes/BaseNode";

interface AudioRecorderProps {
  data: {
    audioRecoderName: string; // Name of the AudioRecorder node
    outputs: { id: string; label: string; value: string }[]; // outputs for the node
    onDataChange: (id: string, data: any) => void;
    onRemoveNode: (id: string) => void;
  };
  id: string;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ data, id }) => {
  const { audioRecoderName, outputs, onDataChange, onRemoveNode } = data;

  return (
    <BaseNode
      id={id}
      name={audioRecoderName}
      defaultName="Audio Recorder"
      nameKey="audioRecoderName"
      type="output"
      outputs={outputs}
      outputPlaceholders={["Audio"]}
      icon={<MicIcon className="w-5 h-5 text-gray-400" />}
      onDataChange={onDataChange}
      onRemoveNode={onRemoveNode}
    >
      {/* Display Images */}

      <div className="flex items-center justify-center bg-gray-50 w-full p-2 pr-8 border rounded-full">
        <div className="p-2 border rounded-full">
          <MicIcon className="w-5 h-5 text-gray-700" />
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-lg px-4 m-2 border"></div>
      </div>
    </BaseNode>
  );
};

export default AudioRecorder;
