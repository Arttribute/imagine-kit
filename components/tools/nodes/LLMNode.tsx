"use client";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Handle, Position } from "reactflow";
import { Bot, Plus, CircleX, Trash2 } from "lucide-react";

interface LLMNodeProps {
  data: {
    inputs: { id: string; value: string }[];
    outputs: { id: string; value: string }[];
    instruction: string;
    botName: string;
    onRemoveNode: (id: string) => void;
    onDataChange: (id: string, data: any) => void;
  };
  id: string;
}

const LLMNode: React.FC<LLMNodeProps> = ({ data, id }) => {
  const { onRemoveNode, onDataChange } = data; // Extract functions from data

  const [isEditingBotName, setIsEditingBotName] = useState(false); // State to manage bot name editing

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

  return (
    <div className="bg-white rounded-xl border p-4 m-1 w-64 shadow-sm">
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
        />
      </div>

      {/* Inputs with dynamically positioned handles */}
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
                backgroundColor: "#3949ab",
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

      {/* Outputs with dynamically positioned handles */}
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
                backgroundColor: "#00838f",
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
