"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

// User-Facing Components
import ImageDisplay from "@/components/imaginekit/ui/display/ImageDisplay";
import FlipCard from "@/components/imaginekit/ui/flipcard/FlipCard";
import ImageTiles from "@/components/imaginekit/ui/imagetiles/ImageTiles";
import TextInput from "@/components/imaginekit/ui/textinput/TextInput";
import TextOutput from "@/components/imaginekit/ui/textoutput/TextOutput";
import WordSelector from "@/components/imaginekit/ui/wordtiles/select/WordSelector";
import WordArranger from "@/components/imaginekit/ui/wordtiles/arrange/WordArranger";
import SketchPad from "@/components/imaginekit/ui/sketchpad/SketchPad";
import ChatInterface from "@/components/imaginekit/ui/chat/ChatInteface";

// Utility function for calling LLM API
import { callGPTApi } from "@/utils/apicalls/gpt";
import { callDalleApi } from "@/utils/apicalls/dalle";

interface Interaction {
  speaker: "user" | "bot";
  message: string;
  bot_id?: string;
}

// Types for node, edge, and UI component data
interface NodeData {
  node_id: string;
  type: string;
  name: string;
  data: {
    inputs: { id: string; label: string; value: string }[];
    outputs: { id: string; label: string; value: string }[];
    instruction?: string;
    memoryFields?: { id: string; label: string; value: string }[];
  };
  position: {
    x: number;
    y: number;
  };
  app_id: string;
}

interface EdgeData {
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
  app_id: string;
}

interface UIComponentData {
  component_id: string;
  type: string;
  label: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  app_id: string;
}

interface RuntimeEngineProps {
  appId: string; // ID of the app being run
}

const RuntimeEngine: React.FC<RuntimeEngineProps> = ({ appId }) => {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [edges, setEdges] = useState<EdgeData[]>([]);
  const [uiComponents, setUIComponents] = useState<UIComponentData[]>([]);
  const [nodeOutputs, setNodeOutputs] = useState<{ [key: string]: any }>({});
  const [nodeExecutionStack, setNodeExecutionStack] = useState<string[]>([]);
  const [executedNodes, setExecutedNodes] = useState<Set<string>>(new Set());
  const [pendingExecution, setPendingExecution] = useState<
    Map<string, Promise<void>>
  >(new Map());

  // Load data from the database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [nodesResponse, edgesResponse, uiComponentsResponse] =
          await Promise.all([
            axios.get(`/api/nodes?appId=${appId}`),
            axios.get(`/api/edges?appId=${appId}`),
            axios.get(`/api/uicomponents?appId=${appId}`),
          ]);

        setNodes(nodesResponse.data);
        setEdges(edgesResponse.data);
        setUIComponents(uiComponentsResponse.data);
      } catch (error) {
        console.error("Failed to fetch data for runtime engine:", error);
      }
    };

    fetchData();
  }, [appId]);

  // Function to execute a single node based on its type
  const executeNode = async (node: NodeData) => {
    //remove node from stack
    removeNodeFromStack(node.node_id);
    console.log("Executing node..:", node.node_id);
    switch (node.type) {
      case "llm":
        await executeLLMNode(node); // Execute LLM Node
        break;
      case "imageGen":
        await executeImageGeneratorNode(node); // Execute Image Generator Node
        break;
      case "textInput":
        await executeTextInputNode(node); // Now handle textInput node execution
        break;
      default:
        console.warn(`Unknown node type: ${node.type}`);
        break;
    }
  };

  // Function to execute an LLM Node
  const executeLLMNode = async (node: NodeData) => {
    const promptInput = node.data.inputs[0]?.value || "start";
    const promptLabel = node.data.inputs[0]?.label;
    if (!promptInput || promptInput === promptLabel) return;

    const { instruction, inputs, outputs } = node.data;

    const inputValues = inputs.map((input) => input.value).join(" ");
    const outputFormat = outputs.map((output) => output.label).join(", ");

    try {
      const generatedOutput = await callGPTApi(
        instruction ?? "",
        inputValues,
        outputFormat
      );

      const outputData = JSON.parse(generatedOutput);

      setNodes((prev) =>
        prev.map((n) =>
          n.node_id === node.node_id
            ? {
                ...n,
                data: {
                  ...n.data,
                  outputs: n.data.outputs.map((output) => ({
                    ...output,
                    value: outputData[output.label], //match gpt output to output label
                  })),
                },
              }
            : n
        )
      );

      const connectedEdges = edges.filter(
        (edge) => edge.source === node.node_id
      );
      connectedEdges.forEach((edge) => {
        const targetNodeIndex = nodes.findIndex(
          (node) => node.node_id === edge.target
        );

        if (targetNodeIndex !== -1) {
          const targetInputIndex = nodes[targetNodeIndex].data.inputs.findIndex(
            (input) => input.id === edge.targetHandle
          );

          if (targetInputIndex !== -1) {
            const label =
              nodes[targetNodeIndex].data.inputs[targetInputIndex].label;
            nodes[targetNodeIndex].data.inputs[targetInputIndex].value =
              outputData[label];

            setNodes([...nodes]);
            //add node to execution stack
            addNodeToStack(nodes[targetNodeIndex]);
            //executeNode(nodes[targetNodeIndex]);
          }
        }
      });
    } catch (error) {
      console.error(`Error executing LLM Node (${node.node_id}):`, error);
    }
  };

  const executeImageGeneratorNode = async (node: NodeData) => {
    const promptInput = node.data.inputs[0]?.value;
    const promptLabel = node.data.inputs[0]?.label;
    if (!promptInput || promptInput === promptLabel) return;

    try {
      const generatedImageUrl = await callDalleApi(promptInput);

      setNodes((prev) =>
        prev.map((n) =>
          n.node_id === node.node_id
            ? {
                ...n,
                data: {
                  ...n.data,
                  outputs: n.data.outputs.map((output) =>
                    output.id === "output-0"
                      ? { ...output, value: generatedImageUrl }
                      : output
                  ),
                },
              }
            : n
        )
      );

      const connectedEdges = edges.filter(
        (edge) => edge.source === node.node_id
      );
      connectedEdges.forEach((edge) => {
        const targetNodeIndex = nodes.findIndex(
          (node) => node.node_id === edge.target
        );

        if (targetNodeIndex !== -1) {
          const targetInputIndex = nodes[targetNodeIndex].data.inputs.findIndex(
            (input) => input.id === edge.targetHandle
          );

          if (targetInputIndex !== -1) {
            nodes[targetNodeIndex].data.inputs[targetInputIndex].value =
              generatedImageUrl;

            setNodes([...nodes]);
            //add node to execution stack
            addNodeToStack(nodes[targetNodeIndex]);
            //executeNode(nodes[targetNodeIndex]);
          }
        }
      });
    } catch (error) {
      console.error(
        `Error executing Image Generator Node (${node.node_id}):`,
        error
      );
    }
  };

  const executeTextInputNode = async (node: NodeData) => {
    console.log("Executing text input node..:", node.node_id);
    // Propagate to connected nodes
    console.log("Propagating data from", node.node_id, "to connected nodes");
    const connectedEdges = edges.filter((edge) => edge.source === node.node_id);
    connectedEdges.forEach((edge) => {
      const targetNodeIndex = nodes.findIndex(
        (node) => node.node_id === edge.target
      );

      if (targetNodeIndex !== -1) {
        const targetInputIndex = nodes[targetNodeIndex].data.inputs.findIndex(
          (input) => input.id === edge.targetHandle
        );

        if (targetInputIndex !== -1) {
          nodes[targetNodeIndex].data.inputs[targetInputIndex].value =
            node.data.outputs[0].value;

          // Trigger a re-render to propagate the data change
          //setNodes([...nodes]);
          console.log("Propagating data from", node.node_id, "to", edge.target);
          console.log("New value:", node.data.outputs[0].value);
          console.log("New node data:", nodes);
          // Execute the target node after updating its input

          //add node to execution stack
          addNodeToStack(nodes[targetNodeIndex]);
          //executeNode(nodes[targetNodeIndex]);
        }
      }
    });
  };

  const runExecutionStack = useCallback(async () => {
    //simply execute the nodes in the stack
    for (const nodeId of nodeExecutionStack) {
      const node = nodes.find((n) => n.node_id === nodeId);
      if (node) {
        await executeNode(node);
      }
    }
  }, [nodeExecutionStack, nodes, executeNode]);

  const addNodeToStack = (node: NodeData) => {
    setNodeExecutionStack((prev) => [...prev, node.node_id]);
  };

  const removeNodeFromStack = (nodeId: string) => {
    setNodeExecutionStack((prev) => prev.filter((id) => id !== nodeId));
  };

  const runApp = useCallback(async () => {
    //simply execute the nodes in the stack
    await runExecutionStack();
  }, [nodes, executeNode]);

  useEffect(() => {
    console.log("Node execution stack:", nodeExecutionStack);
    if (nodeExecutionStack.length > 0) {
      runApp();
    }
  }, [runApp, nodeExecutionStack]);

  useEffect(() => {
    setNodeExecutionStack(nodes.map((node) => node.node_id));
  }, []);

  const handleTextInputSubmit = async (
    nodeId: string,
    fields: Array<{ label: string; value: string }>
  ) => {
    // Find the node that matches the nodeId and update its data
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.node_id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                outputs: fields.map((field) => ({
                  id: field.label,
                  label: field.label,
                  value: field.value,
                })),
              },
            }
          : node
      )
    );

    // After the data is updated, execute the node
    const node = nodes.find((n) => n.node_id === nodeId);
    if (node) {
      //add node to execution stack
      addNodeToStack(node);
      //await executeNode(node);
      console.log("text input node added to stack:", node);
    }
  };

  const handleSketchPadSubmit = useCallback(
    (nodeId: string, imageData: string) => {
      setNodeOutputs((prev) => ({
        ...prev,
        [nodeId]: {
          ...prev[nodeId],
          "output-0": imageData,
        },
      }));

      const connectedEdges = edges.filter((edge) => edge.source === nodeId);
      connectedEdges.forEach((edge) => {
        const targetNodeIndex = nodes.findIndex(
          (node) => node.node_id === edge.target
        );

        if (targetNodeIndex !== -1) {
          const targetInputIndex = nodes[targetNodeIndex].data.inputs.findIndex(
            (input) => input.id === edge.targetHandle
          );

          if (targetInputIndex !== -1) {
            nodes[targetNodeIndex].data.inputs[targetInputIndex].value =
              imageData;

            setNodes([...nodes]);

            executeNode(nodes[targetNodeIndex]);
          }
        }
      });
    },
    [edges, nodes, executeNode]
  );

  return (
    <div>
      {uiComponents.map((component) => {
        const position = component.position;
        return (
          <div
            key={component.component_id}
            style={{
              position: "absolute",
              left: position.x,
              top: position.y,
              width: position.width,
              height: position.height,
            }}
          >
            {renderUIComponent(
              component,
              nodeOutputs[component.component_id],
              nodes.find((node) => node.node_id === component.component_id),
              handleTextInputSubmit,
              handleSketchPadSubmit
            )}
          </div>
        );
      })}
    </div>
  );
};

const renderUIComponent = (
  component: UIComponentData,
  nodeOutput: any,
  nodeData: any,
  handleTextInputSubmit: (
    nodeId: string,
    fields: Array<{ label: string; value: string }>
  ) => void,
  handleSketchPadSubmit: (nodeId: string, imageData: string) => void
): React.ReactNode => {
  switch (component.type) {
    case "imageDisplay":
      return <ImageDisplay images={[nodeData?.data.inputs[0].value]} />;
    case "flipCard":
      return (
        <FlipCard
          frontContentText={nodeOutput?.["output-0"]}
          backContentText={nodeOutput?.["output-1"]}
        />
      );
    case "imageTiles":
      return <ImageTiles src={nodeData?.data.inputs[0].value} numCols={3} />;
    case "textInput":
      return (
        <TextInput
          fields={nodeData?.data.outputs.map((output: any) => ({
            label: output.label,
            value: "",
          }))}
          onSubmit={(fields) => handleTextInputSubmit(nodeData.node_id, fields)}
        />
      );
    case "textOutput":
      return <TextOutput text={nodeData?.data.inputs[0].value} />;
    case "wordSelector":
      return (
        <WordSelector
          correctWords={nodeData?.data.inputs[0].value}
          incorrectWords={nodeData?.data.inputs[1].value}
        />
      );
    case "wordArranger":
      return (
        <WordArranger
          correctWords={nodeData?.data.inputs[0].value}
          setIsCorrect={() => {}}
        />
      );
    case "sketchPad":
      return (
        <SketchPad
          onSubmit={(imageData) =>
            handleSketchPadSubmit(nodeData?.node_id, imageData)
          }
        />
      );
    case "chatInterface":
      return (
        <ChatInterface
          interaction={nodeData?.data.inputs.map((input: any) => ({
            id: input.id,
            label: input.label,
            value: input.value,
          }))}
        />
      );
    default:
      return <div>Unsupported component type: {component.type}</div>;
  }
};

export default RuntimeEngine;
