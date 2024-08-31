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
import ImageGenerator from "@/components/tools/nodes/ImageGenerator"; // Import ImageGenerator
import ImageDisplayNode from "@/components/imaginekit/display/imageDisplayNode"; // Import ImageDisplayNode
import SketchPadNode from "@/components/imaginekit/sketchpad/SketchPadNode";
import CompareNode from "@/components/imaginekit/compare/CompareNode";
import TextInputNode from "@/components/imaginekit/textinput/TextInputNode";
import TextOutputNode from "@/components/imaginekit/textoutput/TextOutputNode";
import WordSelectorNode from "@/components/imaginekit/wordtiles/select/WordSelectorNode";
import WordArrangerNode from "@/components/imaginekit/wordtiles/arrange/WordArrangerNode";
import "reactflow/dist/style.css";

const nodeTypes = {
  custom: CustomNode,
  llm: LLMNode,
  imageGen: ImageGenerator,
  imgDisplay: ImageDisplayNode,
  sketchPad: SketchPadNode,
  compare: CompareNode,
  textInput: TextInputNode,
  textOutput: TextOutputNode,
  wordSelector: WordSelectorNode,
  wordArranger: WordArrangerNode,
};

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const nodesFromStore = useAppSelector((state) => state.flow.nodes);
  const edgesFromStore = useAppSelector((state) => state.flow.edges);

  const [nodes, setNodes, onNodesChange] = useNodesState(
    nodesFromStore.map((node) => ({
      ...node,
      position: node.position || {
        x: Math.random() * 250,
        y: Math.random() * 150,
      },
    }))
  );

  const [edges, setEdges, onEdgesChange] = useEdgesState(
    edgesFromStore.map((edge) => ({
      ...edge,
      id: edge.id?.toString() || `${edge.source}-${edge.target}`,
    }))
  );

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const { source, target, sourceHandle, targetHandle } = params;
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

        const outputValue = sourceNode.data.outputs?.[outputIndex]?.value || "";

        const newInputs = [...(targetNode.data.inputs || [])].map((input) => ({
          ...input,
        }));

        if (newInputs[inputIndex]) {
          newInputs[inputIndex] = {
            ...newInputs[inputIndex],
            value: outputValue,
          };
        } else {
          newInputs[inputIndex] = {
            id: `input-${inputIndex}`,
            value: outputValue,
          };
        }

        handleDataChange(targetNode.id, {
          ...targetNode.data,
          inputs: newInputs,
        });
        console.log("Connected", source, target, sourceHandle, targetHandle);
        console.log("Output Index", outputIndex);
        console.log("Output Value", outputValue);
        console.log("Input Index", inputIndex);
        console.log("New Inputs", newInputs);
      }

      const newEdge = {
        ...params,
        id: `${params.source}-${params.target}`,
        data: {
          sourceHandle: params.sourceHandle,
          targetHandle: params.targetHandle,
        },
      };

      setEdges((eds) => addEdge(newEdge as Edge, eds));
      dispatch(addEdgeAction(newEdge as Edge));
    },
    [setEdges, dispatch, nodes]
  );

  const addNewNode = useCallback(
    (type: string) => {
      const id = `${type}-${nodes.length + 1}`;
      const newNode: Node = {
        id,
        type:
          type === "LLMNode"
            ? "llm"
            : type === "ImageGen"
            ? "imageGen"
            : type === "ImagesDisplay"
            ? "imgDisplay"
            : type === "SketchPad"
            ? "sketchPad"
            : type === "Compare"
            ? "compare"
            : type === "TextInput"
            ? "textInput"
            : type === "TextOutput"
            ? "textOutput"
            : type === "WordSelector"
            ? "wordSelector"
            : type === "WordArranger"
            ? "wordArranger"
            : "custom",
        data: {
          type,
          label: `${type} Node`,
          inputs:
            type === "ImageGen"
              ? [
                  { id: "input-0", label: "Prompt", value: "" },
                  { id: "input-1", label: "Reference Image", value: "" },
                ]
              : type === "ImagesDisplay"
              ? [{ id: "input-0", label: "Image Source", value: "" }]
              : type === "Compare"
              ? [
                  { id: "input-0", label: "Input 1", value: "" },
                  { id: "input-1", label: "Input 2", value: "" },
                ]
              : type === "TextOutput"
              ? [{ id: "input-0", label: "Text source", value: "" }]
              : type === "WordSelector" || type === "WordArranger"
              ? [
                  { id: "input-0", label: "Correct words", value: "" },
                  { id: "input-1", label: "Incorrect words", value: "" },
                ]
              : [],
          outputs: [
            {
              id: "output-0",
              label:
                type === "ImageGen"
                  ? "Generated Image"
                  : type === "SketchPad"
                  ? "Sketch result"
                  : type === "Compare"
                  ? "Comparison result"
                  : type === "TextInput"
                  ? "User content"
                  : type === "WordSelector" || type === "WordArranger"
                  ? "Selected words"
                  : "Output",
              value: "",
            },
          ],
          instruction: type === "LLMNode" ? "" : undefined,
          botName: type === "LLMNode" ? "Bot Name" : undefined,
          imageGenName: type === "ImageGen" ? "Image Generator" : undefined,
          imgDisplayName:
            type === "ImagesDisplay" ? "Image Display" : undefined,
          onRemoveNode: handleRemoveNode,
          onDataChange: handleDataChange,
        },
        position: { x: Math.random() * 250, y: Math.random() * 150 },
      };
      setNodes((nds) => nds.concat(newNode));
      dispatch(
        addNode({
          id,
          type,
          data: newNode.data,
          position: {
            x: 0,
            y: 0,
          },
        })
      );
    },
    [nodes, setNodes, dispatch]
  );

  const handleDataChange = useCallback(
    (id: string, data: any) => {
      setNodes((nds) =>
        nds.map((node) => (node.id === id ? { ...node, data } : node))
      );
      dispatch(updateNodeData({ id, data }));
    },
    [setNodes, dispatch]
  );

  const handleRemoveNode = useCallback(
    (nodeId: string) => {
      const newNodes = nodes.filter((node) => node.id !== nodeId);
      const newEdges = edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      );

      setNodes(newNodes);
      setEdges(newEdges);
    },
    [nodes, edges, setNodes, setEdges]
  );

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
          onClick={() => addNewNode("ImageGen")}
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
        <button
          onClick={() => addNewNode("SketchPad")}
          className="p-2 m-2 bg-blue-500 text-white rounded"
        >
          Add SketchPad
        </button>
        <button
          onClick={() => addNewNode("Compare")}
          className="p-2 m-2 bg-blue-500 text-white rounded"
        >
          Add Compare
        </button>
        <button
          onClick={() => addNewNode("TextInput")}
          className="p-2 m-2 bg-blue-500 text-white rounded"
        >
          Add Text Input
        </button>
        <button
          onClick={() => addNewNode("TextOutput")}
          className="p-2 m-2 bg-blue-500 text-white rounded"
        >
          Add Text Output
        </button>
        <button
          onClick={() => addNewNode("WordArranger")}
          className="p-2 m-2 bg-blue-500 text-white rounded"
        >
          Add Word Arranger
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
