// LLMNode.tsx
"use client";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Handle, Position } from "reactflow";
import { Bot, Plus, CircleX, Trash2, CloudUploadIcon } from "lucide-react";
import { getPDFText } from "@/utils/fileProcessing";

interface LLMNodeProps {
  data: {
    inputs: { id: string; value: string; color?: string }[];
    outputs: { id: string; value: string; color?: string }[];
    instruction: string;
    botName: string;
    knowledgeBase?: {
      name: string;
      content: string;
    };
    onRemoveNode: (id: string) => void;
    onDataChange: (id: string, data: any) => void;
  };
  id: string;
}

const LLMNode: React.FC<LLMNodeProps> = ({ data, id }) => {
  const { onRemoveNode, onDataChange } = data;

  const [isEditingBotName, setIsEditingBotName] = useState(false);

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...data.inputs];
    newInputs[index] = { ...newInputs[index], value };
    onDataChange(id, { ...data, inputs: newInputs });
  };

  const handleOutputChange = (index: number, value: string) => {
    const newOutputs = [...data.outputs];
    newOutputs[index] = { ...newOutputs[index], value };
    onDataChange(id, { ...data, outputs: newOutputs });
  };

  const handleInstructionChange = (value: string) => {
    onDataChange(id, { ...data, instruction: value });
  };

  const handleBotNameChange = (value: string) => {
    onDataChange(id, { ...data, botName: value });
  };

  const addInput = () => {
    const newInputs = [
      ...data.inputs,
      { id: `input-${data.inputs.length}`, value: "" },
    ];
    onDataChange(id, { ...data, inputs: newInputs });
  };

  const removeInput = (index: number) => {
    const newInputs = data.inputs.filter((_, i) => i !== index);
    onDataChange(id, { ...data, inputs: newInputs });
  };

  const addOutput = () => {
    const newOutputs = [
      ...data.outputs,
      { id: `output-${data.outputs.length}`, value: "" },
    ];
    onDataChange(id, { ...data, outputs: newOutputs });
  };

  const removeOutput = (index: number) => {
    const newOutputs = data.outputs.filter((_, i) => i !== index);
    onDataChange(id, { ...data, outputs: newOutputs });
  };

  // Handle file upload
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        //turn file into base64 and get text from pdf
        const base64data = reader.result as string;
        if (base64data) {
          console.log("Base64 file:", base64data);
          getPDFText(base64data).then((text) => {
            console.log("PDF text:", text);
            onDataChange(id, {
              ...data,
              knowledgeBase: {
                name: file.name,
                content: text,
              },
            });
          });
        }
      };
    }
  };

  // Remove knowledge base
  const removeKnowledgeBase = () => {
    onDataChange(id, {
      ...data,
      knowledgeBase: undefined,
    });
  };

  return (
    <div className="bg-white rounded-xl border p-4 m-1 w-80 shadow-sm">
      <div className="flex justify-between mb-3">
        {/* Editable Bot Name */}
        {isEditingBotName ? (
          <input
            type="text"
            value={data.botName}
            onChange={(e) => handleBotNameChange(e.target.value)}
            onBlur={() => setIsEditingBotName(false)}
            className="text-sm font-semibold border-b border-gray-300 focus:outline-none"
            autoFocus
          />
        ) : (
          <p
            className="text-sm font-semibold cursor-pointer"
            onClick={() => setIsEditingBotName(true)}
          >
            {data.botName || "Bot Name"}
          </p>
        )}

        <div className="flex items-center">
          <Bot className="h-4 w-4 text-indigo-600 mb-1 mr-0.5" />
          <p className="text-xs text-indigo-600">Assistant</p>
        </div>
      </div>

      {/* Instruction */}
      <div className="flex flex-col mb-3">
        <p className="mb-1 text-sm font-semibold">Instruction</p>
        <Textarea
          placeholder="Type your instructions here"
          value={data.instruction}
          onChange={(e) => handleInstructionChange(e.target.value)}
          className="nodrag overflow-auto"
          onWheelCapture={(e) => e.stopPropagation()}
        />
      </div>

      {/* Knowledge Base Upload */}
      <div className="flex flex-col mb-3">
        <div className="flex items-center mb-1">
          <p className=" text-sm font-semibold">Knowledge Base</p>
          <p className="text-xs text-gray-500 ml-1">
            {"(Optional) upload pdf"}
          </p>
        </div>

        {data.knowledgeBase && data.knowledgeBase.name !== "" ? (
          <div className="flex border items-center border-indigo-400 rounded-lg pl-3 pr-1 py-1">
            <div className="truncate w-full">
              <p className="text-sm  text-ellipsis overflow-hidden">
                {data.knowledgeBase.name}
              </p>
            </div>
            <Button
              onClick={removeKnowledgeBase}
              className="ml-2"
              variant="ghost"
              size="sm"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <>
            <input
              type="file"
              name="file"
              id="file"
              className="hidden"
              onChange={handleFileUpload}
            />
            <label htmlFor="file" className="w-full">
              <div className="flex w-full border border-dashed border-gray-500 p-1 rounded-lg">
                <div className="flex items-center justify-center border border-gray-900 text-gray-900 px-4 py-1.5 rounded-lg">
                  <CloudUploadIcon className="w-5 h-5 mr-1 text-gray-900" />
                  <p className="text-xs">Upload file</p>
                </div>
              </div>
            </label>
          </>
        )}
      </div>

      {/* Inputs */}
      <div className="flex flex-col mb-3">
        <p className="mb-1 text-sm font-semibold">Inputs</p>
        {data.inputs.map((input, index) => (
          <div key={input.id} className="flex items-center mb-1 relative">
            <Handle
              type="target"
              position={Position.Left}
              id={`input-${index}`}
              style={{
                top: `${index + 20}px`,
                marginLeft: "-18px",
                height: "12px",
                width: "12px",
                backgroundColor: input.color || "#3949ab",
              }}
            />
            <Input
              type="text"
              value={input.value}
              onChange={(e) => handleInputChange(index, e.target.value)}
              placeholder={`Input ${index + 1}`}
              className="border rounded p-1 flex-grow"
            />
            <Button
              onClick={() => removeInput(index)}
              className="ml-1 p-2 rounded-full"
              variant="ghost"
            >
              <CircleX className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button onClick={addInput} variant="outline" className="text-sm">
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Input
        </Button>
      </div>

      {/* Outputs */}
      <div className="flex flex-col mb-3">
        <p className="mb-1 text-sm font-semibold">Outputs</p>
        {data.outputs.map((output, index) => (
          <div key={output.id} className="flex items-center mb-1 relative">
            <Input
              type="text"
              value={output.value}
              onChange={(e) => handleOutputChange(index, e.target.value)}
              placeholder={`Output ${index + 1}`}
              className="border rounded p-1 flex-grow"
            />
            <Button
              onClick={() => removeOutput(index)}
              className="ml-1 p-2 rounded-full"
              variant="ghost"
            >
              <CircleX className="w-4 h-4" />
            </Button>
            <Handle
              type="source"
              position={Position.Right}
              id={`output-${index}`}
              style={{
                top: `${index + 20}px`,
                marginRight: "-18px",
                height: "12px",
                width: "12px",
                backgroundColor: output.color || "#00838f",
              }}
            />
          </div>
        ))}
        <Button onClick={addOutput} variant="outline" className="text-sm">
          <Plus className="w-3.5 h-3.5 mr-1" /> Add Output
        </Button>
      </div>

      <Button
        onClick={() => onRemoveNode(id)}
        variant="ghost"
        className="mt-2 text-red-900 bg-gray-50"
      >
        <Trash2 className="h-4 w-4 mr-1" /> Remove
      </Button>
    </div>
  );
};

export default LLMNode;
