import React from "react";
import { Handle, Position } from "reactflow";

const CustomNode = ({ data, id }: { data: any; id: string }) => {
  const { onRemoveNode, onDataChange } = data; // Extract from data

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...(data.inputs || [])];
    newInputs[index] = { ...newInputs[index], value };
    onDataChange(id, { ...data, inputs: newInputs });
  };

  const handleOutputChange = (index: number, value: string) => {
    const newOutputs = [...(data.outputs || [])];
    newOutputs[index] = { ...newOutputs[index], value };
    onDataChange(id, { ...data, outputs: newOutputs });
  };

  const addInput = () => {
    const newInputs = [
      ...(data.inputs || []),
      { id: `input-${data.inputs.length}`, value: "" },
    ];
    onDataChange(id, { ...data, inputs: newInputs });
  };

  const removeInput = (index: number) => {
    const newInputs = data.inputs.filter((_: any, i: number) => i !== index);
    onDataChange(id, { ...data, inputs: newInputs });
  };

  const addOutput = () => {
    const newOutputs = [
      ...(data.outputs || []),
      { id: `output-${data.outputs.length}`, value: "" },
    ];
    onDataChange(id, { ...data, outputs: newOutputs });
  };

  const removeOutput = (index: number) => {
    const newOutputs = data.outputs.filter((_: any, i: number) => i !== index);
    onDataChange(id, { ...data, outputs: newOutputs });
  };

  return (
    <div className="custom-node border p-2 rounded">
      {data.inputs?.map((input: any, index: number) => (
        <div key={input.id} className="flex items-center mb-1">
          <Handle
            type="target"
            position={Position.Left}
            id={`input-${index}`}
            style={{ top: `${20 + index * 30}px` }}
          />
          <input
            type="text"
            value={input.value}
            onChange={(e) => handleInputChange(index, e.target.value)}
            placeholder={`Input ${index + 1}`}
            className="border rounded p-1 flex-grow"
          />
          <button
            onClick={() => removeInput(index)}
            className="ml-2 text-red-500"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={addInput}
        className="mt-1 p-1 bg-green-500 text-white rounded"
      >
        + Add Input
      </button>

      <div className="mt-4">
        {data.outputs?.map((output: any, index: number) => (
          <div key={output.id} className="flex items-center mb-1">
            <input
              type="text"
              value={output.value}
              onChange={(e) => handleOutputChange(index, e.target.value)}
              placeholder={`Output ${index + 1}`}
              className="border rounded p-1 flex-grow"
            />
            <button
              onClick={() => removeOutput(index)}
              className="ml-2 text-red-500"
            >
              ✕
            </button>
            <Handle
              type="source"
              position={Position.Right}
              id={`output-${index}`}
              style={{ top: `${20 + index * 30}px` }}
            />
          </div>
        ))}
        <button
          onClick={addOutput}
          className="mt-1 p-1 bg-green-500 text-white rounded"
        >
          + Add Output
        </button>
      </div>

      <button onClick={() => onRemoveNode(id)} className="mt-2 text-red-500">
        ✕ Remove Node
      </button>
    </div>
  );
};

export default CustomNode;
