// NodeFlow.tsx
"use client";
import React, { useCallback } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  ReactFlowProvider,
  Edge,
  Connection,
  Node,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
import nodeTypes, {
  NODE_TYPE_MAPPING,
} from "@/components/imaginekit/nodes/nodeTypes";

interface NodeFlowProps {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node<any>[]>>;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge<any>[]>>;
  handleRemoveNode: (nodeId: string) => void;
  handleDataChange: (id: string, data: any) => void;
  onSaveToHistory: () => void;
  connectionColors: string[];
}

const NodeFlow: React.FC<NodeFlowProps> = ({
  nodes,
  setNodes,
  edges,
  setEdges,
  handleRemoveNode,
  handleDataChange,
  onSaveToHistory,
  connectionColors,
}) => {
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges]
  );

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const { source, target, sourceHandle, targetHandle } = params;
      const sourceNode = nodes.find((node) => node.id === source);
      const targetNode = nodes.find((node) => node.id === target);

      // Assign color - let edges of the same source have the same color
      let color = "";
      if (sourceNode) {
        const sourceIndex = nodes.findIndex((node) => node.id === source);
        color = connectionColors[sourceIndex % connectionColors.length];
      }

      if (sourceNode && targetNode) {
        const outputIndex = parseInt(
          sourceHandle?.replace(/^(output-|field-)/, "") || "0",
          10
        );
        const inputIndex = parseInt(
          targetHandle?.replace(/^(input-|field-)/, "") || "0",
          10
        );

        const outputValue =
          sourceNode.type === "memory"
            ? sourceNode.data.memoryFields?.[outputIndex]?.value || ""
            : sourceNode.data.outputs?.[outputIndex]?.value || "";

        // Update the memory node's field when connected to another node
        if (targetNode.type === "memory") {
          const newMemoryFields = [...(targetNode.data.memoryFields || [])];
          newMemoryFields[inputIndex] = {
            ...newMemoryFields[inputIndex],
            value: outputValue,
            label:
              sourceNode.data.outputs?.[outputIndex]?.label ||
              `Memory Field ${inputIndex + 1}`,
          };

          handleDataChange(targetNode.id, {
            ...targetNode.data,
            memoryFields: newMemoryFields,
          });
        } else {
          // Handle normal input nodes
          const newInputs = [...(targetNode.data.inputs || [])];
          newInputs[inputIndex] = {
            ...newInputs[inputIndex],
            value: outputValue,
            color: color,
          };

          const newOutputs = [...(sourceNode.data.outputs || [])];
          newOutputs[outputIndex] = {
            ...newOutputs[outputIndex],
            color: color,
          };

          handleDataChange(sourceNode.id, {
            ...sourceNode.data,
            outputs: newOutputs,
          });

          handleDataChange(targetNode.id, {
            ...targetNode.data,
            inputs: newInputs,
          });
        }

        // If the source node is a memory node, update its fields
        if (sourceNode.type === "memory") {
          const newMemoryFields = [...(sourceNode.data.memoryFields || [])];
          newMemoryFields[outputIndex] = {
            ...newMemoryFields[outputIndex],
            label: newMemoryFields[outputIndex]?.label || "Output Field",
          };

          handleDataChange(sourceNode.id, {
            ...sourceNode.data,
            memoryFields: newMemoryFields,
          });
        }
      }

      const newEdge = {
        ...params,
        id: `${params.source}-${params.target}`,
        data: {
          sourceHandle: params.sourceHandle,
          targetHandle: params.targetHandle,
          color: color,
        },
        style: { stroke: color },
      };

      setEdges((eds) => addEdge(newEdge as Edge, eds));
      onSaveToHistory();
    },
    [nodes, setEdges, handleDataChange, onSaveToHistory, connectionColors]
  );

  const onNodeDragStop = () => {
    onSaveToHistory();
  };

  return (
    <ReactFlowProvider>
      <ReactFlow
        nodes={nodes.map((node) => ({
          ...node,
          data: {
            ...node.data,
            onRemoveNode: handleRemoveNode,
            onDataChange: handleDataChange,
          },
        }))}
        edges={edges}
        onNodesChange={onNodesChange}
        onNodeDragStop={onNodeDragStop}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </ReactFlowProvider>
  );
};

export default NodeFlow;
