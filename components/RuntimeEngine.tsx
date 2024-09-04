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
      switch (node.type) {
        case "llm":
          return executeLLMNode(node);
        case "imageGen":
          return executeImageGeneratorNode(node);
        // Add more cases for each node type
        default:
          console.warn(`Unknown node type: ${node.type}`);
          return null;
      }
    },
    [nodeOutputs]
  );

  // Example function to execute an LLM Node
  const executeLLMNode = async (node: NodeData) => {
    const promptInput = node.data.inputs.find(
      (input) => input.label === "Prompt"
    )?.value;

    if (!promptInput) return;

    // Assume some API call to generate text (replace with actual API call)
    const generatedText = await mockLLMApiCall(promptInput);

    // Set the output for this node
    setNodeOutputs((prev) => ({
      ...prev,
      [node.node_id]: { ...prev[node.node_id], "output-0": generatedText },
    }));
  };

  // Mock function to simulate an LLM API call
  const mockLLMApiCall = async (prompt: string) => {
    // Simulate a delay and return a mock response
    return new Promise((resolve) =>
      setTimeout(() => resolve(`Generated text for: ${prompt}`), 1000)
    );
  };

  // Example function to execute an Image Generator Node
  const executeImageGeneratorNode = async (node: NodeData) => {
    const promptInput = node.data.inputs.find(
      (input) => input.label === "Prompt"
    )?.value;

    if (!promptInput) return;

    // Assume some API call to generate an image URL
    const generatedImageUrl = await mockImageGenApiCall(promptInput);

    // Set the output for this node
    setNodeOutputs((prev) => ({
      ...prev,
      [node.node_id]: { ...prev[node.node_id], "output-0": generatedImageUrl },
    }));
  };

  // Mock function to simulate an Image Generator API call
  const mockImageGenApiCall = async (prompt: string) => {
    // Simulate a delay and return a mock image URL
    return new Promise((resolve) =>
      setTimeout(
        () => resolve(`https://dummyimage.com/600x400/000/fff&text=${prompt}`),
        1000
      )
    );
  };

  // Execute all nodes and manage the data flow
  useEffect(() => {
    const runApp = async () => {
      for (const node of nodes) {
        await executeNode(node);
      }

      // After all nodes are executed, connect outputs to inputs via edges
      connectNodesWithEdges();
    };

    runApp();
  }, [nodes, executeNode]);

  const connectNodesWithEdges = () => {
    // Logic to connect nodes' outputs to the inputs of other nodes
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

            // Trigger a re-render to propagate the data change
            setNodes([...nodes]);
          }
        }
      }
    });
  };

  // Render UI components dynamically
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
            {/* Render component based on type */}
            {renderUIComponent(component, nodeOutputs[component.component_id])}
          </div>
        );
      })}
    </div>
  );
};

// Helper function to render UI components
const renderUIComponent = (
  component: UIComponentData,
  nodeOutput: any
): React.ReactNode => {
  switch (component.type) {
    case "imageDisplay":
      return <ImageDisplay images={[nodeOutput?.["output-0"]]} />;
    case "flipCard":
      return (
        <FlipCard
          frontContentText={nodeOutput?.["output-0"]}
          backContentText={nodeOutput?.["output-1"]}
        />
      );
    case "imageTiles":
      return <ImageTiles src={nodeOutput?.["output-0"]} numCols={3} />;
    case "textInput":
      return <TextInput fields={nodeOutput?.["output-0"] || []} />;
    case "textOutput":
      return <TextOutput text={nodeOutput?.["input-0"]} />;
    case "wordSelector":
      return (
        <WordSelector
          correctWords={nodeOutput?.["input-0"]}
          incorrectWords={nodeOutput?.["input-1"]}
        />
      );
    case "wordArranger":
      return (
        <WordArranger
          correctWords={nodeOutput?.["input-0"]}
          setIsCorrect={() => {}}
        />
      );
    // Add more UI component cases here
    default:
      return <div>Unsupported component type: {component.type}</div>;
  }
};

export default RuntimeEngine;
