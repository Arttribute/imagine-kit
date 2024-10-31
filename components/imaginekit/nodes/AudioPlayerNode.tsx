"use client";
import React from "react";
import { Volume2Icon } from "lucide-react";
import BaseNode from "@/components/imaginekit/nodes/BaseNode";

interface AudioPlayerNodeProps {
  data: {
    audioPlayerName: string; // Name of the AudioPlayerNode node
    inputs: { id: string; label: string; value: string }[]; // Inputs for the node
    onDataChange: (id: string, data: any) => void;
    onRemoveNode: (id: string) => void;
  };
  id: string;
}

const AudioPlayerNode: React.FC<AudioPlayerNodeProps> = ({ data, id }) => {
  const { audioPlayerName, inputs, onDataChange, onRemoveNode } = data;

  return (
    <BaseNode
      id={id}
      name={audioPlayerName}
      defaultName="Audio Player"
      nameKey="audioPlayerName"
      type="input"
      inputs={inputs}
      inputPlaceholders={["Audio Source"]}
      icon={<Volume2Icon className="w-5 h-5 text-gray-400" />}
      onDataChange={onDataChange}
      onRemoveNode={onRemoveNode}
    >
      {/* Display Images */}

      <div className="flex items-center justify-center bg-gray-50 w-full p-2 pr-8 border rounded-full">
        <div className="p-2 border rounded-full">
          <Volume2Icon className="w-5 h-5 text-gray-700" />
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-lg px-4 m-2 border"></div>
      </div>
    </BaseNode>
  );
};

export default AudioPlayerNode;
