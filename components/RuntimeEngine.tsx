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
import TriggerButton from "@/components/imaginekit/ui/triggerbutton/TriggerButton";
import LoadingWorld from "@/components/worlds/LoadingWorld";
import AudioPlayer from "@/components/imaginekit/ui/audio/AudioPlayer";

// Utility function for calling LLM API
import { callGPTApi } from "@/utils/apicalls/gpt";
import { callDalleApi } from "@/utils/apicalls/dalle";
import { callTTSApi } from "@/utils/apicalls/opentts";

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
    memory?: { inputs: string; outputs: string }[]; // Adding memory here
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
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingWorldComponents, setLoadingWorldComponents] =
    useState<boolean>(false);
  // const [executedNodes, setExecutedNodes] = useState<Set<string>>(new Set());
  // const [pendingExecution, setPendingExecution] = useState<
  //   Map<string, Promise<void>>
  // >(new Map());

  // Load data from the database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingWorldComponents(true);
        const [nodesResponse, edgesResponse, uiComponentsResponse] =
          await Promise.all([
            axios.get(`/api/nodes?appId=${appId}`),
            axios.get(`/api/edges?appId=${appId}`),
            axios.get(`/api/uicomponents?appId=${appId}`),
          ]);

        setNodes(nodesResponse.data);
        setEdges(edgesResponse.data);
        setUIComponents(uiComponentsResponse.data);
        setLoadingWorldComponents(false);
        //setNodeExecutionStack(nodesResponse.data);
      } catch (error) {
        console.error("Failed to fetch data for runtime engine:", error);
      }
    };

    fetchData();
  }, [appId]);

  // Function to execute a single node based on its type
  const executeNode = async (node: NodeData) => {
    //remove node from stack
    setLoading(true);
    removeNodeFromStack(node.node_id);
    console.log("Executing node..:", node);
    switch (node.type) {
      case "llm":
        await executeLLMNode(node); // Execute LLM Node
        break;
      case "imageGen":
        await executeImageGeneratorNode(node); // Execute Image Generator Node
        break;
      case "textToSpeech":
        await executeTextToSpeechNode(node); // Execute Text to Speech Node
        break;
      case "textInput":
        await executeTextInputNode(node); // Now handle textInput node execution
        break;
      case "triggerButton":
        await executeTriggerButtonNode(node); // Execute Trigger Button Node
        break;
      case "sketchPad":
        await executeSketchPadNode(node); // Execute Sketch Pad Node
        break;
      default:
        console.warn(`Unknown node type: ${node.type}`);
        break;
    }
    setLoading(false);
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

  // Function to execute a Trigger Button Node
  const executeTriggerButtonNode = async (node: NodeData) => {
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
          setNodes([...nodes]);
          //log value passed to target node
          console.log(
            "Value passed to target node:",
            node.data.outputs[0].value
          );
          addNodeToStack(nodes[targetNodeIndex]);
        }
      }
    });
    //reset the button value
    setNodes((prev) =>
      prev.map((n) =>
        n.node_id === node.node_id
          ? {
              ...n,
              data: {
                ...n.data,
                outputs: [
                  {
                    ...n.data.outputs[0],
                    value: "",
                  },
                ],
              },
            }
          : n
      )
    );
  };

  // Function to execute an LLM Node
  const executeLLMNode = async (node: NodeData) => {
    const promptInput = node.data.inputs[0]?.value || "start";
    const promptLabel = node.data.inputs[0]?.label;
    if (!promptInput || promptInput === promptLabel) return;

    const { instruction, inputs, outputs } = node.data;

    const inputOutputmemory = node.data.memory;
    const CurrentnputValues = inputs.map((input) => input.value).join(" ");
    const outputFormat = outputs.map((output) => output.label).join(", ");

    //lets send current input and  history of the past input and output to the API
    //inputValues = {input: "current input", memory: [{inputs: "past input", outputs: "past output"}]}
    //stringify the inputValues object and send it to the API

    try {
      const generatedOutput = await callGPTApi(
        instruction ?? "",
        CurrentnputValues,
        outputFormat,
        JSON.stringify(inputOutputmemory ?? [])
      );

      // Remove backticks and sanitize GPT output before parsing - this due to a an issue that is specific to GPT-4o-mini
      const cleanedOutput = generatedOutput
        .replace(/```json/g, "") // Remove "```json" if present
        .replace(/```/g, "") // Remove trailing "```"
        .trim(); // Trim any extra spaces or newlines

      const outputData = JSON.parse(cleanedOutput);

      // Update the nodes memory with the current input and output
      const updatedMemory = [
        ...(node.data.memory ?? []),
        {
          inputs: CurrentnputValues,
          outputs: outputData,
        },
      ];
      const updatedOutputs = outputs.map((output) => ({
        ...output,
        value: outputData[output.label],
      }));

      nodes[nodes.findIndex((n) => n.node_id === node.node_id)].data.memory =
        updatedMemory;
      nodes[nodes.findIndex((n) => n.node_id === node.node_id)].data.outputs =
        updatedOutputs;
      setNodes([...nodes]);

      //propagate data to connected nodes
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
            addNodeToStack(nodes[targetNodeIndex]);
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

  const executeTextToSpeechNode = async (node: NodeData) => {
    const textInput = node.data.inputs[0]?.value;
    const textLabel = node.data.inputs[0]?.label;
    if (!textInput || textInput === textLabel) return;

    try {
      const generatedAudio = (await callTTSApi(textInput)) as string;

      setNodes((prev) =>
        prev.map((n) =>
          n.node_id === node.node_id
            ? {
                ...n,
                data: {
                  ...n.data,
                  outputs: n.data.outputs.map((output) =>
                    output.id === "output-0"
                      ? { ...output, value: generatedAudio }
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
              generatedAudio;

            setNodes([...nodes]);
            addNodeToStack(nodes[targetNodeIndex]);
          }
        }
      });
    } catch (error) {
      console.error(
        `Error executing Text to Speech Node (${node.node_id}):`,
        error
      );
    }
  };

  const executeSketchPadNode = async (node: NodeData) => {
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
          addNodeToStack(nodes[targetNodeIndex]);
        }
      }
    });
  };

  const executeTextInputNode = async (node: NodeData) => {
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
          addNodeToStack(nodes[targetNodeIndex]);
        }
      }
    });
  };

  const handleTriggerButtonClick = (nodeId: string, buttonValue: string) => {
    console.log("Trigger button clicked:", buttonValue);
    //log current output value of the node with the given nodeId
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.node_id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                outputs: [
                  {
                    ...node.data.outputs[0],
                    value: buttonValue,
                  },
                ],
              },
            }
          : node
      )
    );

    const node = nodes.find((n) => n.node_id === nodeId);
    if (node) {
      addNodeToStack(node);
      console.log("trigger button node added to stack:", node);
    }
  };

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

  const handleSketchPadSubmit = (nodeId: string, imageData: string) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.node_id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                outputs: [
                  {
                    ...node.data.outputs[0],
                    value: imageData,
                  },
                ],
              },
            }
          : node
      )
    );

    const node = nodes.find((n) => n.node_id === nodeId);
    if (node) {
      addNodeToStack(node);
      console.log("Sketch pad added to stack:", node);
    }
  };

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <div
        className=""
        style={{
          position: "relative", // Makes children position relative to this parent
          width: "600px", // Set width based on your design
          height: "400px", // Set height based on your design
        }}
      >
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
                nodes.find((node) => node.node_id === component.component_id),
                loading,
                handleTextInputSubmit,
                handleSketchPadSubmit,
                handleTriggerButtonClick
              )}
            </div>
          );
        })}
        {loadingWorldComponents && (
          <div style={{ display: "absolute", width: "80vw" }}>
            <LoadingWorld />
          </div>
        )}
      </div>
    </div>
  );
};

const renderUIComponent = (
  component: UIComponentData,
  nodeData: any,
  loading: boolean,
  handleTextInputSubmit: (
    nodeId: string,
    fields: Array<{ label: string; value: string }>
  ) => void,
  handleSketchPadSubmit: (nodeId: string, imageData: string) => void,
  handleTriggerButtonClick: (nodeId: string, buttonValue: string) => void
): React.ReactNode => {
  switch (component.type) {
    case "triggerButton":
      return (
        <TriggerButton
          buttonName={nodeData?.data?.outputs[0]?.label}
          onClickButton={(buttonValue) =>
            handleTriggerButtonClick(nodeData?.node_id, buttonValue)
          }
          loading={loading}
        />
      );
    case "imageDisplay":
      return (
        <ImageDisplay
          images={[nodeData?.data?.inputs[0]?.value]}
          loading={loading}
        />
      );
    case "flipCard":
      return (
        <FlipCard
          frontTitle={nodeData?.data?.inputs[0]?.value}
          backTitle={nodeData?.data?.inputs[1]?.value}
          frontContentText={nodeData?.data?.inputs[2]?.value}
          backContentText={nodeData?.data?.inputs[3]?.value}
          frontImageUrl={nodeData?.data?.inputs[4]?.value}
          backImageUrl={nodeData?.data?.inputs[5]?.value}
          loading={loading}
        />
      );
    case "imageTiles":
      return (
        <ImageTiles
          src={nodeData?.data?.inputs[0]?.value}
          numCols={3}
          loading={loading}
        />
      );
    case "textInput":
      return (
        <TextInput
          fields={nodeData?.data.outputs.map((output: any) => ({
            label: output.label,
            value: "",
          }))}
          onSubmit={(fields) =>
            handleTextInputSubmit(nodeData?.node_id, fields)
          }
          loading={loading}
        />
      );
    case "textOutput":
      return (
        <TextOutput text={nodeData?.data?.inputs[0]?.value} loading={loading} />
      );
    case "wordSelector":
      return (
        <WordSelector
          correctWords={nodeData?.data?.inputs[0]?.value}
          incorrectWords={nodeData?.data?.inputs[1]?.value}
          loading={loading}
        />
      );
    case "wordArranger":
      return (
        <WordArranger
          correctWords={nodeData?.data?.inputs[0]?.value}
          setIsCorrect={() => {}}
        />
      );
    case "sketchPad":
      return (
        <SketchPad
          setImageData={(imageData) =>
            handleSketchPadSubmit(nodeData?.node_id, imageData)
          }
        />
      );
    case "chatInterface":
      return (
        <ChatInterface
          interaction={nodeData?.data?.inputs?.map((input: any) => ({
            id: input.id,
            label: input.label,
            value: input.value,
          }))}
          loading={loading}
        />
      );
    case "audioPlayer":
      return (
        <AudioPlayer
          audio={nodeData?.data?.inputs[0]?.value}
          loading={loading}
        />
      );
    default:
      return <div>Unsupported component type: {component.type}</div>;
  }
};

export default RuntimeEngine;
