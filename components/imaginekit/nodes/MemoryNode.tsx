"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Handle, Position } from "reactflow";
import { Button } from "@/components/ui/button";
import { Brain, Plus, Trash2, CircleX } from "lucide-react";

interface MemoryNodeProps {
  data: {
    memoryName: string; // Name of the MemoryNode
    memoryFields: { id: string; label: string; value: string }[]; // Fields that are both inputs and outputs
    onDataChange: (id: string, data: any) => void;
    onRemoveNode: (id: string) => void;
  };
  id: string;
}

const MemoryNode: React.FC<MemoryNodeProps> = ({ data, id }) => {
  const { memoryName, memoryFields, onDataChange, onRemoveNode } = data;
  const [isEditingName, setIsEditingName] = useState(false); // State to manage memory name editing

  // Handle name change
  const handleNameChange = (name: string) => {
    onDataChange(id, { ...data, memoryName: name });
  };

  // Handle changes for memory fields (both input and output)
  const handleMemoryFieldChange = (index: number, value: string) => {
    const newFields = [...memoryFields];
    newFields[index] = { ...newFields[index], value };
    onDataChange(id, { ...data, memoryFields: newFields });
  };

  // Add a new memory field
  const addMemoryField = () => {
    const newField = {
      id: `field-${memoryFields.length}`,
      label: `Memory Field ${memoryFields.length + 1}`,
      value: "",
    };
    onDataChange(id, { ...data, memoryFields: [...memoryFields, newField] });
  };

  // Remove a memory field by index
  const removeMemoryField = (index: number) => {
    const newFields = memoryFields.filter((_, i) => i !== index);
    onDataChange(id, { ...data, memoryFields: newFields });
  };

  return (
    <div className="border p-4 m-1 rounded-lg shadow-sm bg-white w-96">
      <div className="flex justify-between mb-3">
        {/* Editable Memory Node Name */}
        {isEditingName ? (
          <input
            type="text"
            value={memoryName}
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
            {memoryName || "Memory Node"}
          </p>
        )}
        <div className="flex items-center">
          <Brain className="h-4 w-4 text-purple-600 mb-1 mr-0.5" />
          <p className="text-xs text-purple-600">Memory</p>
        </div>
      </div>

      {/* Render Memory Fields as Both Input and Output */}
      {memoryFields.map((field, index) => (
        <div key={field.id} className="flex mb-1 relative">
          {/* Input Handle */}
          <Handle
            type="target"
            position={Position.Left}
            id={field.id}
            style={{
              top: "50px",
              marginLeft: "-18px",
              height: "12px",
              width: "12px",
              backgroundColor: "#3949ab",
            }}
          />
          {/* Field Content */}
          <div className="flex flex-col relative z-10 w-full">
            <div className="flex items-center justify-cemter ">
              <p className="mb-1 text-sm font-semibold">{field.label}</p>
              <button
                onClick={() => removeMemoryField(index)}
                className="ml-1 p-2 rounded-full"
              >
                <CircleX className="w-4 h-4" />
              </button>
            </div>
            <Input
              type="text"
              placeholder={`Enter ${field.label}`}
              value={field.value}
              onChange={(e) => handleMemoryFieldChange(index, e.target.value)}
              className="border rounded p-1 w-full bg-white"
            />
          </div>

          {/* Output Handle */}
          <Handle
            type="source"
            position={Position.Right}
            id={field.id}
            style={{
              top: "50px",
              marginRight: "-18px",
              height: "12px",
              width: "12px",
              backgroundColor: "#00838f",
            }}
          />
        </div>
      ))}

      {/* Button to Add a New Memory Field */}
      <Button onClick={addMemoryField} variant="outline" className="text-sm">
        <Plus className="w-3.5 h-3.5 mr-1" />
        Add Field
      </Button>

      {/* Remove Node Button */}
      <div className="m-2"></div>

      <Button
        onClick={() => onRemoveNode(id)}
        variant="ghost"
        className="mt-2 text-red-900 bg-gray-50"
      >
        <Trash2 className="h-4 w-4 mr-1" /> Remove Node
      </Button>
    </div>
  );
};

export default MemoryNode;
