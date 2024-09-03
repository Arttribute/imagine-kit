"use client";
import React, { useCallback, useState, useEffect } from "react";
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
} from "@/store/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomNode from "../components/imaginekit/nodes/CustomNode"; // Existing CustomNode
import LLMNode from "@/components/imaginekit/nodes/LLMNode"; // Import LLMNode
import ImageGeneratorNode from "@/components/imaginekit/nodes/ImageGeneratorNode"; // Import ImageGeneratorNode
import ImageDisplayNode from "@/components/imaginekit/nodes/ImageDisplayNode"; // Import ImageDisplayNode
import ImageTilesNode from "@/components/imaginekit/nodes/ImageTilesNode";
import SketchPadNode from "@/components/imaginekit/nodes/SketchPadNode";
import CompareNode from "@/components/imaginekit/nodes/CompareNode";
import TextInputNode from "@/components/imaginekit/nodes/TextInputNode";
import TextOutputNode from "@/components/imaginekit/nodes/TextOutputNode";
import WordSelectorNode from "@/components/imaginekit/nodes/WordSelectorNode";
import WordArrangerNode from "@/components/imaginekit/nodes/WordArrangerNode";
import FlipCardNode from "@/components/imaginekit/nodes/FlipCardNode";
import ChatInterfaceNode from "@/components/imaginekit/nodes/ChatInterfaceNode";
import MemoryNode from "@/components/imaginekit/nodes/MemoryNode";
import AppToolbar from "@/components/tools/toolbar/AppToolbar";
import UIEditor from "@/components/UIEditor"; // Import UIEditor

import "reactflow/dist/style.css";

const nodeTypes = {
  custom: CustomNode,
  llm: LLMNode,
  imageGen: ImageGeneratorNode,
  imageDisplay: ImageDisplayNode,
  imageTiles: ImageTilesNode,
  sketchPad: SketchPadNode,
  compare: CompareNode,
  textInput: TextInputNode,
  textOutput: TextOutputNode,
  wordSelector: WordSelectorNode,
  wordArranger: WordArrangerNode,
  flipCard: FlipCardNode,
  chatInterface: ChatInterfaceNode,
  memory: MemoryNode,
};

interface ComponentPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface UIComponent {
  id: string;
  label: string;
  type: string; // Type to determine the preview
}

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

  // Manage UI components and their positions
  const [uiComponents, setUIComponents] = useState<UIComponent[]>([]);
  const [savedComponentPositions, setSavedComponentPositions] = useState<{
    [key: string]: ComponentPosition;
  }>({});

  // Automatically add a corresponding UI component when a node is added
  useEffect(() => {
    const uiNodes = nodes
      .filter((node) =>
        [
          "imageDisplay",
          "imageTiles",
          "sketchPad",
          "textInput",
          "textOutput",
          "wordSelector",
          "wordArranger",
          "flipCard",
          "chatInterface",
        ].includes(node.type ?? "")
      )
      .map((node) => ({
        id: node.id,
        label: node.data.label,
        type: node.type ?? "",
      }));

    setUIComponents(uiNodes);
  }, [nodes]);

  const saveComponentPositions = useCallback(
    (positions: { [key: string]: ComponentPosition }) => {
      setSavedComponentPositions(positions);
    },
    []
  );

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const { source, target, sourceHandle, targetHandle } = params;
      const sourceNode = nodes.find((node) => node.id === source);
      const targetNode = nodes.find((node) => node.id === target);

      if (sourceNode && targetNode) {
        const outputIndex = parseInt(
          sourceNode.type === "memory"
            ? sourceHandle?.replace("field-", "") || "0"
            : sourceHandle?.replace("output-", "") || "0",
          10
        );
        const inputIndex = parseInt(
          targetNode.type === "memory"
            ? targetHandle?.replace("field-", "") || "0"
            : targetHandle?.replace("input-", "") || "0",
          10
        );

        const outputValue =
          sourceNode.type === "memory"
            ? sourceNode.data.memoryFields?.[outputIndex]?.value || ""
            : sourceNode.data.outputs?.[outputIndex]?.value || "";

        // Handle MemoryNode specifically
        if (targetNode.type === "memory") {
          const newMemoryFields = [...(targetNode.data.memoryFields || [])].map(
            (field) => ({
              ...field,
            })
          );

          // Update the connected memory field with the output value
          if (newMemoryFields[inputIndex]) {
            newMemoryFields[inputIndex] = {
              ...newMemoryFields[inputIndex],
              value: outputValue,
            };
          } else {
            newMemoryFields[inputIndex] = {
              id: `field-${inputIndex}`,
              label: `Memory Field ${inputIndex + 1}`,
              value: outputValue,
            };
          }

          handleDataChange(targetNode.id, {
            ...targetNode.data,
            memoryFields: newMemoryFields,
          });
        } else {
          // Handle normal input nodes
          const newInputs = [...(targetNode.data.inputs || [])].map(
            (input) => ({
              ...input,
            })
          );

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
        }

        // Update source node when connected to memory node input
        if (sourceNode.type === "memory") {
          const newMemoryFields = [...(sourceNode.data.memoryFields || [])].map(
            (field) => ({
              ...field,
            })
          );

          // Find the memory field associated with the output index and update its label
          if (newMemoryFields[outputIndex]) {
            newMemoryFields[outputIndex].label =
              newMemoryFields[outputIndex].label || "Output Field";
          }

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
            ? "imageDisplay"
            : type === "ImageTiles"
            ? "imageTiles"
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
            : type === "FlipCard"
            ? "flipCard"
            : type === "ChatInterface"
            ? "chatInterface"
            : type === "Memory"
            ? "memory"
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
              : type === "ImagesDisplay" || type === "ImageTiles"
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
              : type === "FlipCard"
              ? [
                  { id: "input-0", label: "Front text", value: "" },
                  { id: "input-1", label: "Back text", value: "" },
                  { id: "input-2", label: "Front image", value: "" },
                  { id: "input-3", label: "Back image", value: "" },
                ]
              : type === "ChatInterface"
              ? [
                  { id: "input-0", label: "User input", value: "" },
                  { id: "input-1", label: "Bot response", value: "" },
                ]
              : [],
          outputs: [
            {
              id: "output-0",
              label:
                type === "ImageGen"
                  ? "Generated Image"
                  : type === "ImageTiles"
                  ? "Arranged Images"
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
          memoryFields:
            type === "Memory"
              ? [{ id: "field-0", label: "Memory Field 1", value: "" }]
              : undefined,
          imageGenName: type === "ImageGen" ? "Image Generator" : undefined,
          imageDisplayName:
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
      <div style={{ display: "flex", height: "100vh" }}>
        <AppToolbar addNewNode={addNewNode} />

        <Tabs defaultValue="nodes" className="w-full">
          <TabsList className="grid w-full grid-cols-2 w-[400px] m-2">
            <TabsTrigger value="nodes">Logic flow</TabsTrigger>
            <TabsTrigger value="preview">UI preview</TabsTrigger>
          </TabsList>
          <TabsContent value="nodes">
            <div style={{ display: "flex", height: "100vh" }}>
              <div
                style={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
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
            </div>
          </TabsContent>
          {/* UIEditor to display UI components */}
          <TabsContent value="preview">
            <div style={{ display: "flex", height: "80vh", width: "64vw" }}>
              <UIEditor
                uiComponents={uiComponents}
                savedPositions={savedComponentPositions}
                savePositions={saveComponentPositions}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ReactFlowProvider>
  );
};

export default HomePage;
