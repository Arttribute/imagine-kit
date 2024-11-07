"use client";
import React, { useState } from "react";
import { Sparkles, Trash2 } from "lucide-react";
import AdvancedOptions from "@/components/tools/AdvancedOptions";
import BaseNode from "@/components/imaginekit/nodes/BaseNode";

interface ImageGeneratorNodeProps {
  data: {
    imageGenName: string;
    inputs: { id: string; label: string; value: string }[];
    outputs: { id: string; label: string; value: string }[];
    generatedImage: string; // Single output field for generated image
    onRemoveNode: (id: string) => void;
    onDataChange: (id: string, data: any) => void;
  };
  id: string;
}

const ImageGeneratorNode: React.FC<ImageGeneratorNodeProps> = ({
  data,
  id,
}) => {
  const { imageGenName, inputs, outputs, onDataChange, onRemoveNode } = data;

  return (
    <BaseNode
      id={id}
      name={imageGenName}
      defaultName="Image Generator"
      nameKey="imageGenName"
      type="both"
      inputs={inputs}
      outputs={outputs}
      inputPlaceholders={["Prompt"]}
      outputPlaceholders={["Generated Image"]}
      icon={
        <div className="flex items-center">
          <Sparkles className="h-4 w-4 text-gray-500 mb-1 mr-0.5" />
          <p className="text-xs text-gray-500">Image Gen</p>
        </div>
      }
      onDataChange={onDataChange}
      onRemoveNode={onRemoveNode}
    >
      {/* Advanced Options */}
      <AdvancedOptions
        openControlnetOptions={false}
        numberOfImages={1}
        setNumberOfImages={() => {}}
        numSteps={1}
        setNumSteps={() => {}}
        cfgScale={1}
        setCfgScale={() => {}}
        width={512}
        setWidth={() => {}}
        height={512}
        setHeight={() => {}}
        superResolution={false}
        setSuperResolution={() => {}}
        privateCreation={false}
        setPrivateCreation={() => {}}
        aspectRatio="1:1"
        setAspectRatio={() => {}}
        scheduler="greedy"
        setScheduler={() => {}}
        colorGrading=""
        setColorGrading={() => {}}
        negativePrompt=""
        setNegativePrompt={() => {}}
      />
    </BaseNode>
  );
};

export default ImageGeneratorNode;
