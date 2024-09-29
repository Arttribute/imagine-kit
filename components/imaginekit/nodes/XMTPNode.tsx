import React, { useState } from "react";
import { KeyboardIcon, Plus, Minus } from "lucide-react";
import BaseNode from "@/components/imaginekit/nodes/BaseNode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface XMTPNodeProps {
  data: {
    xmtpName: string;
    outputs: { id: string; label: string; value: string }[];
    inputs: { id: string; label: string; value: string }[];
    onDataChange: (id: string, data: any) => void;
    onRemoveNode: (id: string) => void;
  };
  id: string;
}

const XMTPNode: React.FC<XMTPNodeProps> = ({ data, id }) => {
  const { xmtpName, outputs, inputs, onDataChange, onRemoveNode } = data;
  const [isEditingName, setIsEditingName] = useState(false); // State for editing name

  // Handle output change
  const handleOutputChange = (index: number, value: string) => {
    const newOutputs = [...outputs];
    newOutputs[index] = { ...newOutputs[index], value };
    onDataChange(id, { ...data, outputs: newOutputs });
  };

  // Add a new output field
  const addOutput = () => {
    const newOutputId = `output-${outputs.length}`;
    const newOutputs = [
      ...outputs,
      { id: newOutputId, label: `Output ${outputs.length + 1}`, value: "" },
    ];
    onDataChange(id, { ...data, outputs: newOutputs });
  };

  // Remove the last output field
  const removeLastOutput = () => {
    if (outputs.length > 0) {
      const newOutputs = outputs.slice(0, -1); // Remove the last output
      onDataChange(id, { ...data, outputs: newOutputs });
    }
  };

  return (
    <BaseNode
      id={id}
      name={xmtpName}
      defaultName="XMTP"
      nameKey="xmtpName"
      type="both"
      outputs={outputs}
      inputs={inputs}
      icon={<KeyboardIcon className="w-5 h-5 text-gray-400" />}
      onDataChange={onDataChange}
      onRemoveNode={onRemoveNode}
    >
      <div className="w-full">
        {/* Static input description */}
        <div className="relative bg-gray-50 flex rounded-lg border-2 p-2">
          <KeyboardIcon className="w-5 h-5 text-gray-400 mr-2" />
          <p className="text-gray-400 text-sm">User input here</p>
        </div>

        {/* Buttons to Add or Remove Output Fields */}
        <div className="flex justify-between mt-2">
          <Button onClick={addOutput} variant="outline" className="text-sm">
            <Plus className="w-4 h-4 mr-1" />
            Add Field
          </Button>
          <Button
            onClick={removeLastOutput}
            variant="outline"
            className="text-sm"
            disabled={outputs.length === 1}
          >
            <Minus className="w-4 h-4 mr-1" />
            Remove
          </Button>
        </div>
      </div>
    </BaseNode>
  );
};

export default XMTPNode;
