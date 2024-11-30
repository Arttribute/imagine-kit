import React from "react";
import { ClipboardList, Plus, Minus } from "lucide-react";
import BaseNode from "@/components/imaginekit/nodes/BaseNode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const FIELD_TYPES = [
  { value: "text", label: "Text Input" },
  { value: "file", label: "File Upload" },
  { value: "camera", label: "Camera" },
  { value: "sketchpad", label: "Sketchpad" },
  { value: "audio", label: "Audio Recorder" },
];

interface MultiInputFormNodeProps {
  data: {
    multiInputFormName: string;
    outputs: {
      id: string;
      label: string;
      type: string;
      value: string;
    }[];
    onDataChange: (id: string, data: any) => void;
    onRemoveNode: (id: string) => void;
  };
  id: string;
}

const MultiInputFormNode: React.FC<MultiInputFormNodeProps> = ({
  data,
  id,
}) => {
  const { multiInputFormName, outputs, onDataChange, onRemoveNode } = data;

  // Handle output change
  const handleOutputChange = (
    index: number,
    field: Partial<(typeof outputs)[0]>
  ) => {
    const newOutputs = [...outputs];
    newOutputs[index] = { ...newOutputs[index], ...field };
    onDataChange(id, { ...data, outputs: newOutputs });
  };

  // Add a new output field
  const addOutput = () => {
    const newOutputId = `field-${outputs.length}`;
    const newOutputs = [
      ...outputs,
      {
        id: newOutputId,
        label: `Field ${outputs.length + 1}`,
        type: "text",
        value: "",
      },
    ];
    onDataChange(id, { ...data, outputs: newOutputs });
  };

  // Remove the last output field
  const removeLastOutput = () => {
    if (outputs.length > 1) {
      const newOutputs = outputs.slice(0, -1); // Remove the last output
      onDataChange(id, { ...data, outputs: newOutputs });
    }
  };

  return (
    <BaseNode
      id={id}
      name={multiInputFormName}
      defaultName="Multi Input Form"
      nameKey="multiInputFormName"
      type="output"
      outputs={outputs}
      outputPlaceholders={["Form output"]}
      icon={<ClipboardList className="w-5 h-5 text-gray-400" />}
      onDataChange={onDataChange}
      onRemoveNode={onRemoveNode}
    >
      <div className="w-full">
        {/* List of fields */}
        {outputs.map((field, index) => (
          <div key={field.id} className="flex items-center mb-2">
            <Input
              placeholder="Field Label"
              value={field.label}
              onChange={(e) =>
                handleOutputChange(index, { label: e.target.value })
              }
              className="mr-2"
            />
            <Select
              value={field.type}
              onValueChange={(value) =>
                handleOutputChange(index, { type: value })
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select field type" />
              </SelectTrigger>
              <SelectContent>
                {FIELD_TYPES.map((typeOption) => (
                  <SelectItem key={typeOption.value} value={typeOption.value}>
                    {typeOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}

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

export default MultiInputFormNode;
