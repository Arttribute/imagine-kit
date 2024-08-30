"use client";
import React, { useCallback } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  ReactFlowProvider,
  Connection,
  Edge,
  Node,
  useNodesState,
  useEdgesState,
} from "reactflow";
import { useAppDispatch, useAppSelector } from "../store/store";
import {
  addNode,
  updateNodeData,
  addEdge as addEdgeAction,
} from "../store/store";
import CustomNode from "../components/CustomNode"; // Existing CustomNode
import LLMNode from "@/components/tools/nodes/LLMNode"; // Import LLMNode
import "reactflow/dist/style.css";

const nodeTypes = {
  custom: CustomNode,
  llm: LLMNode, // Register LLMNode type
};

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const nodesFromStore = useAppSelector((state) => state.flow.nodes);
  const edgesFromStore = useAppSelector((state) => state.flow.edges);
  const [nodes, setNodes, onNodesChange] = useNodesState(nodesFromStore);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgesFromStore);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const { source, target, sourceHandle, targetHandle } = params;

      // Find the source node and output field
      const sourceNode = nodes.find((node) => node.id === source);
      const targetNode = nodes.find((node) => node.id === target);

      if (sourceNode && targetNode) {
        const outputIndex = parseInt(
          sourceHandle?.replace("output-", "") || "0",
          10
        );
        const inputIndex = parseInt(
          targetHandle?.replace("input-", "") || "0",
          10
        );

        const outputValue = sourceNode.data.outputs[outputIndex].value;

        // Update the target node's input with the source node's output value
        const newInputs = [...targetNode.data.inputs];
        newInputs[inputIndex] = {
          ...newInputs[inputIndex],
          value: outputValue,
        };

        handleDataChange(targetNode.id, {
          ...targetNode.data,
          inputs: newInputs,
        });
      }

      // Add the connection
      const newEdge = {
        ...params,
        data: {
          sourceHandle: params.sourceHandle,
          targetHandle: params.targetHandle,
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
      dispatch(addEdgeAction(newEdge));
    },
    [setEdges, dispatch, nodes]
  );

  const addNewNode = (type: string) => {
    const id = `${type}-${nodes.length + 1}`;
    const newNode: Node = {
      id,
      type: type === "LLMNode" ? "llm" : "custom", // Specify node type
      data: {
        type,
        label: `${type} Node`,
        inputs: [],
        outputs: [],
        instruction: "", // For LLMNode specific fields
        botName: "Bot Name", // Default bot name for LLMNode
        onRemoveNode: handleRemoveNode,
        onDataChange: handleDataChange,
      },
      position: { x: Math.random() * 250, y: Math.random() * 150 },
    };
    setNodes((nds) => nds.concat(newNode));
    dispatch(addNode({ id, type, data: newNode.data }));
  };

  const handleDataChange = (id: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) => (node.id === id ? { ...node, data } : node))
    );
    dispatch(updateNodeData({ id, data }));
  };

  const handleRemoveNode = (nodeId: string) => {
    const newNodes = nodes.filter((node) => node.id !== nodeId);
    const newEdges = edges.filter(
      (edge) => edge.source !== nodeId && edge.target !== nodeId
    );

    setNodes(newNodes);
    setEdges(newEdges);
  };

  return (
    <ReactFlowProvider>
      <div style={{ height: 800 }}>
        <button
          onClick={() => addNewNode("LLMNode")}
          className="p-2 m-2 bg-blue-500 text-white rounded"
        >
          Add LLM Node
        </button>
        <button
          onClick={() => addNewNode("ImageGenerator")}
          className="p-2 m-2 bg-blue-500 text-white rounded"
        >
          Add Image Generator
        </button>
        <button
          onClick={() => addNewNode("ImagesDisplay")}
          className="p-2 m-2 bg-blue-500 text-white rounded"
        >
          Add Images Display
        </button>
        <button
          onClick={() => addNewNode("WordSelector")}
          className="p-2 m-2 bg-blue-500 text-white rounded"
        >
          Add Word Selector
        </button>

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
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
};

export default HomePage;
