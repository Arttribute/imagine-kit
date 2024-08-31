"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Handle, Position } from "reactflow";
import { Sparkles } from "lucide-react";
import AdvancedOptions from "@/components/tools/AdvancedOptions";

interface ImageGeneratorProps {
  data: {
    imageGenName: string;
    inputs: { id: string; label: string; value: string }[];
    outputs: { id: string; value: string }[];
    generatedImage: string; // Single output field for generated image
    onRemoveNode: (id: string) => void;
    onDataChange: (id: string, data: any) => void;
  };
  id: string;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ data, id }) => {
  const {
    onRemoveNode,
    onDataChange,
    imageGenName,
    inputs,
    outputs,
    generatedImage,
  } = data;

  const [isEditingImageGenName, setIsEditingImageGenName] = useState(false); // State to manage image gen name editing

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = { ...newInputs[index], value };
    onDataChange(id, { ...data, inputs: newInputs });
  };

  const handleOutputChange = (index: number, value: string) => {
    const newOutputs = [...data.outputs];
    newOutputs[index] = { ...newOutputs[index], value };
    onDataChange(id, { ...data, outputs: newOutputs });
  };

  const removeInputField = (index: number) => {
    const newInputs = inputs.filter((_, i) => i !== index);
    onDataChange(id, { ...data, inputs: newInputs });
  };

  return (
    <div className="rounded-xl border p-4 m-1 w-64 shadow-sm bg-white">
      <div className="flex justify-between mb-3">
        {/* Editable Image Generator Name */}
        {isEditingImageGenName ? (
          <input
            type="text"
            value={imageGenName}
            onChange={(e) =>
              onDataChange(id, { ...data, imageGenName: e.target.value })
            }
            onBlur={() => setIsEditingImageGenName(false)}
            className="text-sm font-semibold border-b border-gray-300 focus:outline-none"
            autoFocus
          />
        ) : (
          <p
            className="text-sm font-semibold cursor-pointer"
            onClick={() => setIsEditingImageGenName(true)}
          >
            {imageGenName || "Generator"}
          </p>
        )}

        <div className="flex items-center">
          <Sparkles className="h-4 w-4 text-gray-500 mb-1 mr-0.5" />
          <p className="text-xs text-gray-500">Image Gen</p>
        </div>
      </div>

      {/* Render Predefined Input Fields and Dynamic Input Fields */}
      {inputs.map((input, index) => (
        <div key={input.id} className="relative mb-3">
          <Handle
            type="target"
            position={Position.Left}
            id={`input-${index}`}
            style={{
              top: `40px`,
              marginLeft: "-18px",
              height: "12px",
              width: "12px",
              backgroundColor: "#3949ab",
            }}
          />
          <div className="flex flex-col relative z-10">
            <p className="mb-1 text-sm font-semibold">{input.label}</p>
            <Input
              placeholder={input.label}
              value={input.value}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className="border rounded p-1 flex-grow bg-white"
            />
          </div>
        </div>
      ))}

      {/* Output Handle for Generated Image */}
      <div className="relative mb-3">
        <div className="flex flex-col relative z-10">
          <p className="mb-1 text-sm font-semibold">Generated Image</p>
          <Input
            placeholder="Generated image link"
            value={outputs[0].value}
            className="border rounded p-1 flex-grow bg-white"
            onChange={(e) => handleOutputChange(0, e.target.value)}
          />
        </div>
        <Handle
          type="source"
          position={Position.Right}
          id={`output-0`}
          style={{
            top: `40px`,
            marginRight: "-18px",
            height: "12px",
            width: "12px",
            backgroundColor: "#00838f",
          }}
        />
      </div>

      {/* Advanced Options (unchanged) */}
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

      {/* Remove Node Button */}
      <button onClick={() => onRemoveNode(id)} className="mt-2 text-red-500">
        ✕ Remove Node
      </button>
    </div>
  );
};

export default ImageGenerator;
