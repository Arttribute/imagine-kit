"use client";
import React from "react";
import { PowerIcon } from "lucide-react";
import BaseNode from "@/components/imaginekit/nodes/BaseNode";

interface TriggerButtonNodeProps {
  data: {
    triggerButtonName: string; // Name of the TriggerButtonNode node
    outputs: { id: string; label: string; value: string }[]; // outputs for the node
    onDataChange: (id: string, data: any) => void;
    onRemoveNode: (id: string) => void;
  };
  id: string;
}

const TriggerButtonNode: React.FC<TriggerButtonNodeProps> = ({ data, id }) => {
  const { triggerButtonName, outputs, onDataChange, onRemoveNode } = data;

  return (
    <BaseNode
      id={id}
      name={triggerButtonName}
      defaultName="Trigger Button"
      nameKey="triggerButtonName"
      type="output"
      outputs={outputs}
      outputPlaceholders={["Trigger"]}
      icon={
        <div className="flex items-center">
          <PowerIcon className="w-4 h-4 text-gray-400 mr-1" />
          <p className="text-xs text-gray-500">Trigger Button</p>
        </div>
      }
      onDataChange={onDataChange}
      onRemoveNode={onRemoveNode}
    >
      <div className="relative bg-gray-50 flex rounded-lg border-2 p-2">
        <div className="border rounded-lg p-2 flex w-full">
          <PowerIcon className="w-5 h-5 text-gray-400 mr-2 " />
          <p className="text-gray-400 text-sm"> Press button to start</p>
        </div>
      </div>
    </BaseNode>
  );
};

export default TriggerButtonNode;
