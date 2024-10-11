"use client";
import React from "react";
import { SpeechIcon, TypeOutlineIcon } from "lucide-react";
import BaseNode from "@/components/imaginekit/nodes/BaseNode";

interface TextToSpeechNodeProps {
  data: {
    textToSpeechName: string; // Name of the TextToSpeechNode node
    inputs: { id: string; label: string; value: string }[]; // Inputs for the node
    outputs: { id: string; label: string; value: string }[]; // Outputs for the node
    onDataChange: (id: string, data: any) => void;
    onRemoveNode: (id: string) => void;
  };
  id: string;
}

const TextToSpeechNode: React.FC<TextToSpeechNodeProps> = ({ data, id }) => {
  const { textToSpeechName, inputs, outputs, onDataChange, onRemoveNode } =
    data;

  return (
    <BaseNode
      id={id}
      name={textToSpeechName}
      defaultName="text to speech"
      nameKey="textToSpeechName"
      type="both"
      inputs={inputs}
      outputs={outputs}
      icon={<SpeechIcon className="w-5 h-5 text-gray-400" />}
      onDataChange={onDataChange}
      onRemoveNode={onRemoveNode}
    >
      <div className="relative bg-gray-50 flex rounded-lg border-2 p-2">
        <TypeOutlineIcon className="w-5 h-5 text-gray-400 mr-2" />
        <SpeechIcon className="w-5 h-5 text-gray-400 mr-2" />
        <p className="text-gray-400 text-sm">Convert text to speech</p>
      </div>
    </BaseNode>
  );
};

export default TextToSpeechNode;
