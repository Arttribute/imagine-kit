"use client";
import React from "react";
import { AudioWaveformIcon, TypeOutlineIcon } from "lucide-react";
import BaseNode from "@/components/imaginekit/nodes/BaseNode";

interface SpeechToTextProps {
  data: {
    speechToTextName: string; // Name of the SpeechToText node
    inputs: { id: string; label: string; value: string }[]; // Inputs for the node
    outputs: { id: string; label: string; value: string }[]; // Outputs for the node
    onDataChange: (id: string, data: any) => void;
    onRemoveNode: (id: string) => void;
  };
  id: string;
}

const SpeechToText: React.FC<SpeechToTextProps> = ({ data, id }) => {
  const { speechToTextName, inputs, outputs, onDataChange, onRemoveNode } =
    data;

  return (
    <BaseNode
      id={id}
      name={speechToTextName}
      defaultName="Speech to Text"
      nameKey="speechToTextName"
      type="both"
      inputs={inputs}
      outputs={outputs}
      inputPlaceholders={["Audio Source"]}
      outputPlaceholders={["Text"]}
      icon={<AudioWaveformIcon className="w-5 h-5 text-gray-400" />}
      onDataChange={onDataChange}
      onRemoveNode={onRemoveNode}
    >
      <div className="relative bg-gray-50 flex rounded-lg border-2 p-2">
        <AudioWaveformIcon className="w-5 h-5 text-gray-400 mr-2" />
        <TypeOutlineIcon className="w-5 h-5 text-gray-400 mr-2" />

        <p className="text-gray-400 text-sm">Convert text to speech</p>
      </div>
    </BaseNode>
  );
};

export default SpeechToText;
