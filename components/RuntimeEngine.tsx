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
      if (executedNodes.has(node.node_id)) return; // Skip if node has already been executed

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

      setExecutedNodes((prev) => new Set(prev).add(node.node_id)); // Mark node as executed
    },
    [executedNodes]
  );

  // Function to execute an LLM Node
  const executeLLMNode = async (node: NodeData) => {
    const { instruction, inputs, outputs } = node.data;

    // Get input values from the node's inputs
    const inputValues = inputs.map((input) => input.value).join(" ");

    // Prepare the outputs format
    const outputFormat = outputs.map((output) => output.label).join(", ");

    try {
      // Call the LLM API
      const generatedOutput = await callGPTApi(
        instruction ?? "",
        inputValues,
        outputFormat
      );

      // Assume the API returns output in JSON format that matches the requested output format
      const outputData = JSON.parse(generatedOutput);
      console.log("LLM Node output:", outputData);

      //Update the node's output value with the corresponding output eg if output =={sentence: "Hello World"} then the node data with the sentence label will be updated with the value "Hello World" ie node.data.outputs[label].value = output.sentence
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
      // Find all edges connected to this node's output and propagate data and update the connected node input with the output value
      const connectedEdges = edges.filter(
        (edge) => edge.source === node.node_id
      );
      connectedEdges.forEach((edge) => {
        const targetNodeIndex = nodes.findIndex(
          (node) => node.node_id === edge.target
        );

        console.log("Connected Edges:", connectedEdges);
        console.log("LLM Target Node Index:", targetNodeIndex);
        if (targetNodeIndex !== -1) {
          const targetInputIndex = nodes[targetNodeIndex].data.inputs.findIndex(
            (input) => input.id === edge.targetHandle
          );
          console.log("LLM Target Input Index:", targetInputIndex);

          if (targetInputIndex !== -1) {
            //get node output label
            const label =
              nodes[targetNodeIndex].data.inputs[targetInputIndex].label;
            console.log("LLM Target Input Label:", label);
            nodes[targetNodeIndex].data.inputs[targetInputIndex].value =
              outputData[label];
            console.log("LLM Target Input Value:", outputData[label]);
            console.log(
              " Edge:",
              edge,
              "Edge target handle",
              edge.targetHandle
            );

            // Trigger a re-render to propagate the data change
            setNodes([...nodes]);

            // Execute the target node after updating its input
            executeNode(nodes[targetNodeIndex]);
          }
        }
      });
    } catch (error) {
      console.error(`Error executing LLM Node (${node.node_id}):`, error);
    }
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
  const runApp = useCallback(async () => {
    // Execute start nodes first
    for (const node of nodes.filter((node) => node.data.inputs.length === 0)) {
      await executeNode(node);
    }

    // Execute nodes with inputs next
    for (const node of nodes.filter((node) => node.data.inputs.length > 0)) {
      await executeNode(node);
    }
    console.log("Executed nodes:", executedNodes);
    console.log("Nodes:", nodes);
    console.log("All nodes executed!");

    // After all nodes are executed, connect outputs to inputs via edges
    connectNodesWithEdges();
  }, [nodes, executeNode]);

  // Separate useEffect for running the app
  useEffect(() => {
    runApp();
  }, [runApp]);

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

  // Function to handle data submission from TextInput
  const handleTextInputSubmit = useCallback(
    (nodeId: string, fields: Array<{ label: string; value: string }>) => {
      // Update the node's outputs with the submitted field values
      console.log("TextInput submitted for node", nodeId);
      // Update the node's outputs with the submitted field values ie node.data.outputs.value === fields.value
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
      //reset executed nodes
      setExecutedNodes(new Set());

      // Find all edges connected to this node's output and propagate data
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

            // Trigger a re-render to propagate the data change
            //setNodes([...nodes]);
            console.log("Propagating data from", nodeId, "to", edge.target);
            console.log("New value:", fields[0].value);
            console.log("New node data:", nodes);
            // Execute the target node after updating its input
            executeNode(nodes[targetNodeIndex]);
          }
        }
      });
    },
    [edges, nodes, executeNode]
  );

  // Function to handle data submission from SketchPad
  const handleSketchPadSubmit = useCallback(
    (nodeId: string, imageData: string) => {
      // Update the node's output with the submitted image data
      setNodeOutputs((prev) => ({
        ...prev,
        [nodeId]: {
          ...prev[nodeId],
          "output-0": imageData, // Store the image data in output-0
        },
      }));

      // Find all edges connected to this node's output and propagate data
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

            // Trigger a re-render to propagate the data change
            setNodes([...nodes]);

            // Execute the target node after updating its input
            executeNode(nodes[targetNodeIndex]);
          }
        }
      });
    },
    [edges, nodes, executeNode]
  );

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
            {renderUIComponent(
              component,
              nodeOutputs[component.component_id],
              nodes.find((node) => node.node_id === component.component_id),
              handleTextInputSubmit, // Pass the callback to handle TextInput submit
              handleSketchPadSubmit // Pass the callback to handle SketchPad submit
            )}
          </div>
        );
      })}
    </div>
  );
};

// Helper function to render UI components
const renderUIComponent = (
  component: UIComponentData,
  nodeOutput: any,
  nodeData: any,
  handleTextInputSubmit: (
    nodeId: string,
    fields: Array<{ label: string; value: string }>
  ) => void,
  handleSketchPadSubmit: (nodeId: string, imageData: string) => void // Include SketchPad callback
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
      return (
        <TextInput
          fields={nodeData.data.outputs.map((output: any) => ({
            label: output.label,
            value: "",
          }))}
          onSubmit={(fields) => handleTextInputSubmit(nodeData.node_id, fields)}
        />
      );
    case "textOutput":
      return <TextOutput text={nodeData.data.inputs[0].value} />;
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
    case "sketchPad":
      return (
        <SketchPad
          onSubmit={(imageData) =>
            handleSketchPadSubmit(nodeData.node_id, imageData)
          }
        />
      );
    // Add more UI component cases here
    default:
      return <div>Unsupported component type: {component.type}</div>;
  }
};

export default RuntimeEngine;
