"use client";
import React, { useState, ReactNode } from "react";
import { Handle, Position } from "reactflow";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface BaseNodeProps {
  id: string;
  name: string;
  type: "input" | "output" | "both"; // Type of node
  inputs?: { id: string; label: string; value: string }[]; // Optional inputs
  outputs?: { id: string; label: string; value: string }[]; // Optional outputs
  icon?: ReactNode; // Icon to display
  onDataChange: (id: string, data: any) => void;
  onRemoveNode: (id: string) => void;
  children?: ReactNode; // Additional children components
}

const BaseNode: React.FC<BaseNodeProps> = ({
  id,
  name,
  type,
  inputs = [],
  outputs = [],
  icon,
  onDataChange,
  onRemoveNode,
  children,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);

  const handleNameChange = (newName: string) => {
    onDataChange(id, { name: newName });
  };

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = { ...newInputs[index], value };
    onDataChange(id, { inputs: newInputs });
  };

  const handleOutputChange = (index: number, value: string) => {
    const newOutputs = [...outputs];
    newOutputs[index] = { ...newOutputs[index], value };
    onDataChange(id, { outputs: newOutputs });
  };

  return (
    <div className="border p-4 m-1 rounded-xl shadow-sm bg-white w-80">
      <div className="flex justify-between mb-3">
        {isEditingName ? (
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            onBlur={() => setIsEditingName(false)}
            className="text-sm font-semibold border-b border-gray-300 focus:outline-none"
            autoFocus
          />
        ) : (
          <p
            className="text-sm font-semibold cursor-pointer"
            onClick={() => setIsEditingName(true)}
          >
            {name}
          </p>
        )}
        {icon && <div className="flex items-center">{icon}</div>}
      </div>

      {/* Input Fields with Handles */}
      {type !== "output" &&
        inputs.map((input, index) => (
          <div key={input.id} className="relative mb-3">
            <Handle
              type="target"
              position={Position.Left}
              id={`input-${input.id}`}
              style={{
                marginTop: `10px`,
                marginLeft: "-18px",
                height: "12px",
                width: "12px",
                backgroundColor: "#3949ab",
              }}
            />
            <div className="flex flex-col relative z-10">
              <p className="mb-1 text-sm font-semibold">{input.label}</p>
              <Input
                type="text"
                placeholder={input.label}
                value={input.value}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="border rounded p-1 flex-grow bg-white"
              />
            </div>
          </div>
        ))}

      {/* Custom Children (e.g., Canvas, Advanced Options, etc.) */}
      {children}

      {/* Output Fields with Handles */}
      {type !== "input" &&
        outputs.map((output, index) => (
          <div key={output.id} className="relative mt-4">
            <p className="text-sm font-semibold">{output.label}</p>
            <Input
              type="text"
              placeholder={output.label}
              value={output.value}
              onChange={(e) => handleOutputChange(index, e.target.value)}
              className="border rounded p-1 flex-grow bg-white"
            />
            <Handle
              type="source"
              position={Position.Right}
              id={`output-${output.id}`}
              style={{
                top: "40",
                right: "-22px",
                height: "12px",
                width: "12px",
                backgroundColor: "#00838f",
              }}
            />
          </div>
        ))}

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

export default BaseNode;
