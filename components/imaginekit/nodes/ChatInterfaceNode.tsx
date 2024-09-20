import React, { useState } from "react";
import {
  MessageSquareMore,
  AlignLeftIcon,
  MessageSquare,
  Plus,
  Minus,
} from "lucide-react";
import BaseNode from "@/components/imaginekit/nodes/BaseNode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInterfaceNodeProps {
  data: {
    chatInterfaceName: string; // Name of the ChatInterfaceNode node
    inputs: { id: string; label: string; value: string }[]; // Inputs for the node
    outputs: { id: string; label: string; value: string }[]; // Outputs for the node
    onDataChange: (id: string, data: any) => void;
    onRemoveNode: (id: string) => void;
  };
  id: string;
}

const ChatInterfaceNode: React.FC<ChatInterfaceNodeProps> = ({ data, id }) => {
  const { chatInterfaceName, inputs, outputs, onDataChange, onRemoveNode } =
    data;

  // Handle input change
  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = { ...newInputs[index], value };
    onDataChange(id, { ...data, inputs: newInputs });
  };

  // Add a new input field
  const addInput = () => {
    const newInputId = `input-${inputs.length}`;
    const newInputs = [
      ...inputs,
      { id: newInputId, label: `Input ${inputs.length + 1}`, value: "" },
    ];
    onDataChange(id, { ...data, inputs: newInputs });
  };

  // Remove the last input field
  const removeLastInput = () => {
    if (inputs.length > 0) {
      const newInputs = inputs.slice(0, -1); // Remove the last input
      onDataChange(id, { ...data, inputs: newInputs });
    }
  };

  // Handle output change (in case you need to manage output data similarly)
  const handleOutputChange = (index: number, value: string) => {
    const newOutputs = [...outputs];
    newOutputs[index] = { ...newOutputs[index], value };
    onDataChange(id, { ...data, outputs: newOutputs });
  };

  return (
    <BaseNode
      id={id}
      name={chatInterfaceName}
      defaultName="Chat Interface"
      nameKey="chatInterfaceName"
      type="both"
      inputs={inputs} // Use dynamic inputs
      outputs={outputs}
      icon={
        <div className="flex items-center">
          <MessageSquare className="w-4 h-4 text-gray-400 mr-1" />
          <p className="text-xs text-gray-500">Chat</p>
        </div>
      }
      onDataChange={onDataChange}
      onRemoveNode={onRemoveNode}
    >
      <div className="w-full">
        {/* Buttons to Add or Remove Input Fields */}
        <div className="flex justify-between my-2">
          <Button onClick={addInput} variant="outline" className="text-sm">
            <Plus className="w-4 h-4 mr-1" />
            Add Input
          </Button>
          <Button
            onClick={removeLastInput}
            variant="outline"
            className="text-sm"
            disabled={inputs.length === 1}
          >
            <Minus className="w-4 h-4 mr-1" />
            Remove Input
          </Button>
        </div>

        <div className="w-full">
          <div className="relative bg-gray-50 flex rounded-lg border-2 p-2">
            <MessageSquareMore className="w-5 h-5 text-gray-400 mr-2" />
            <AlignLeftIcon className="w-5 h-5 text-gray-400 mr-2" />
            <p className="text-gray-400 text-sm">Chat Interface</p>
          </div>
        </div>
      </div>
    </BaseNode>
  );
};

export default ChatInterfaceNode;
