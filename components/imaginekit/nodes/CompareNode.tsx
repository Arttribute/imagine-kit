"use client";
import React from "react";
import BaseNode from "@/components/imaginekit/nodes/BaseNode";

interface CompareNodeProps {
  data: {
    compareName: string; // Name of the CompareNode
    inputs: { id: string; label: string; value: string }[]; // Two inputs
    outputs: { id: string; label: string; value: string }[]; // One output
    onDataChange: (id: string, data: any) => void;
    onRemoveNode: (id: string) => void;
  };
  id: string;
}

const CompareNode: React.FC<CompareNodeProps> = ({ data, id }) => {
  const { compareName, inputs, outputs, onDataChange, onRemoveNode } = data;

  return (
    <BaseNode
      id={id}
      name={compareName}
      defaultName="Compare"
      nameKey="compareName"
      type="both"
      inputs={inputs}
      outputs={outputs}
      onDataChange={onDataChange}
      onRemoveNode={onRemoveNode}
    ></BaseNode>
  );
};

export default CompareNode;
