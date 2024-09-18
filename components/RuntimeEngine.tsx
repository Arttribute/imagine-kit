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

// Utility function for calling LLM API
import { callGPTApi } from "@/utils/apicalls/gpt";
import { callDalleApi } from "@/utils/apicalls/dalle";

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
  const executeNode = useCallback(
    async (node: NodeData) => {
      // Check if the node is already being executed or has been executed
      if (executedNodes.has(node.node_id) || pendingExecution.has(node.node_id))
        return;

      const nodeExecutionPromise = (async () => {
        switch (node.type) {
          case "llm":
            await executeLLMNode(node); // Execute LLM Node
            break;
          case "imageGen":
            await executeImageGeneratorNode(node); // Execute Image Generator Node
            break;
          // Add more cases for each node type
          default:
            console.warn(`Unknown node type: ${node.type}`);
            break;
        }

        // Mark node as executed after the promise resolves
        setExecutedNodes((prev) => new Set(prev).add(node.node_id));
        setPendingExecution((prev) => {
          const newMap = new Map(prev);
          newMap.delete(node.node_id);
          return newMap;
        });
      })();

      // Add the node execution promise to pendingExecution
      setPendingExecution((prev) =>
        new Map(prev).set(node.node_id, nodeExecutionPromise)
      );
    },
    [executedNodes, pendingExecution, edges, nodes]
  );

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
                    value: outputData[output.label],
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

            executeNode(nodes[targetNodeIndex]);
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

            executeNode(nodes[targetNodeIndex]);
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

  const runApp = useCallback(async () => {
    // Execute start nodes first
    for (const node of nodes.filter((node) => node.data.inputs.length === 0)) {
      await executeNode(node);
    }

    // Execute nodes with inputs next
    for (const node of nodes.filter((node) => node.data.inputs.length > 0)) {
      await executeNode(node);
    }

    connectNodesWithEdges();
  }, [nodes, executeNode]);

  useEffect(() => {
    if (nodes.length > 0) {
      runApp();
    }
  }, [nodes, runApp]);

  const connectNodesWithEdges = () => {
    edges.forEach((edge) => {
      const sourceOutput = nodeOutputs[edge.source]?.[edge.sourceHandle];
      if (sourceOutput) {
        const targetNodeIndex = nodes.findIndex(
          (node) => node.node_id === edge.target
        );

        if (targetNodeIndex !== -1) {
          const targetInputIndex = nodes[targetNodeIndex].data.inputs.findIndex(
            (input) => input.id === edge.targetHandle
          );

          if (targetInputIndex !== -1) {
            nodes[targetNodeIndex].data.inputs[targetInputIndex].value =
              sourceOutput;

            setNodes([...nodes]);
          }
        }
      }
    });
  };

  const handleTextInputSubmit = useCallback(
    (nodeId: string, fields: Array<{ label: string; value: string }>) => {
      setNodes((prev) =>
        prev.map((node) =>
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
      setExecutedNodes(new Set());

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
              fields[0].value;

            executeNode(nodes[targetNodeIndex]);
          }
        }
      });
    },
    [edges, nodes, executeNode]
  );

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
          incorrectWords={nodeData?.data.inputs[1].value.toString()}
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
    default:
      return <div>Unsupported component type: {component.type}</div>;
  }
};

export default RuntimeEngine;
