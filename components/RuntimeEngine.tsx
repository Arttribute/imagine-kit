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
import AudioRecorder from "@/components/imaginekit/ui/audio/AudioRecorder";
import Camera from "@/components/imaginekit/ui/camera/Camera";
import FileUpload from "@/components/imaginekit/ui/fileupload/FileUpload";

// Utility function for calling LLM API
import { callGPTApi } from "@/utils/apicalls/gpt";
import { callDalleApi } from "@/utils/apicalls/dalle";
import { callTTSApi } from "@/utils/apicalls/opentts";
import { callWhisperApi } from "@/utils/apicalls/whisper";

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
  const [nodeExecutionStack, setNodeExecutionStack] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingWorldComponents, setLoadingWorldComponents] =
    useState<boolean>(false);

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
      case "speechToText":
        await executeSpeechToTextNode(node); // Execute Speech to Text Node
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
      case "audioRecorder":
        await executeAudioRecorderNode(node); // Execute Audio Player Node
        break;
      case "camera":
        await executeCameraNode(node); // Execute Camera Node
        break;
      case "fileUpload":
        await executeFileUploadNode(node); // Execute File Upload Node
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

  const propagateDataToConnectedNodes = (node: NodeData) => {
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

  // Function to execute a Trigger Button Node
  const executeTriggerButtonNode = async (node: NodeData) => {
    propagateDataToConnectedNodes(node);
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

  const executeSpeechToTextNode = async (node: NodeData) => {
    const audioInput = node.data.inputs[0]?.value;
    const audioLabel = node.data.inputs[0]?.label;
    if (!audioInput || audioInput === audioLabel) return;

    try {
      const generatedText = await callWhisperApi(audioInput);

      setNodes((prev) =>
        prev.map((n) =>
          n.node_id === node.node_id
            ? {
                ...n,
                data: {
                  ...n.data,
                  outputs: n.data.outputs.map((output) =>
                    output.id === "output-0"
                      ? { ...output, value: generatedText }
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
              generatedText;

            setNodes([...nodes]);
            addNodeToStack(nodes[targetNodeIndex]);
          }
        }
      });
    } catch (error) {
      console.error(
        `Error executing Speech to Text Node (${node.node_id}):`,
        error
      );
    }
  };

  const executeSketchPadNode = async (node: NodeData) => {
    propagateDataToConnectedNodes(node);
  };

  const executeTextInputNode = async (node: NodeData) => {
    propagateDataToConnectedNodes(node);
  };

  const executeAudioRecorderNode = async (node: NodeData) => {
    propagateDataToConnectedNodes(node);
  };

  const executeCameraNode = async (node: NodeData) => {
    propagateDataToConnectedNodes(node);
  };

  const executeFileUploadNode = async (node: NodeData) => {
    propagateDataToConnectedNodes(node);
  };

  const handleDataSubmit = (
    nodeId: string,
    data: string | Array<{ label: string; value: string }>,
    nodeName: string
  ) => {
    setNodes((prevNodes) => {
      const updatedNodes = prevNodes.map((node) =>
        node.node_id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                outputs: Array.isArray(data)
                  ? data.map(({ label, value }) => ({
                      id: label,
                      label,
                      value,
                    }))
                  : [
                      {
                        ...node.data.outputs[0],
                        value: data,
                      },
                    ],
              },
            }
          : node
      );

      // Find the updated node to add to the stack
      const updatedNode = updatedNodes.find((n) => n.node_id === nodeId);
      if (updatedNode) {
        addNodeToStack(updatedNode);
        console.log(`${nodeName} added to stack:`, updatedNode);
      }

      return updatedNodes;
    });
  };

  const [isMobile, setIsMobile] = useState(false);

  // Effect to detect mobile screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Run on initial load
    window.addEventListener("resize", handleResize); // Update on window resize

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Function to group components by columns based on `x` range
  const groupByColumns = (components: any[], columnWidth = 100) => {
    const columns: { [key: number]: any[] } = {};
    components.forEach((component) => {
      const x = component.position.x;
      // Calculate the column by dividing x by columnWidth (adjust this width as needed)
      const column = Math.floor(x / columnWidth);

      if (!columns[column]) {
        columns[column] = [];
      }
      columns[column].push(component);
    });
    return columns;
  };

  const sortedComponents = isMobile
    ? Object.values(groupByColumns(uiComponents))
        // Sort each column by `y` position in ascending order
        .map((column) => column.sort((a, b) => a.position.y - b.position.y))
        // Flatten the sorted columns into one array
        .flat()
    : uiComponents;

  return (
    <div
      className={`${
        isMobile && "fixed left-0 right-0 flex items-center justify-center"
      } p-1 `}
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "initial", // Stack components vertically for mobile
      }}
    >
      <div
        style={{
          position: "relative",
        }}
      >
        {sortedComponents.map((component) => {
          const position = component.position;
          return (
            <div
              key={component.component_id}
              style={{
                position: isMobile ? "relative" : "absolute", // Absolute for desktop, relative for mobile
                left: isMobile ? "auto" : position.x,
                top: isMobile ? "auto" : position.y,
                width: position.width,
                height: position.height,
                marginBottom: isMobile ? "20px" : "0", // Add spacing between components for mobile
              }}
            >
              {renderUIComponent(
                component,
                nodes.find((node) => node.node_id === component.component_id),
                loading,
                handleDataSubmit
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
  handleDataSubmit: (
    nodeId: string,
    data: string | Array<{ label: string; value: string }>,
    nodeName: string
  ) => void
): React.ReactNode => {
  switch (component.type) {
    case "triggerButton":
      return (
        <TriggerButton
          buttonName={nodeData?.data?.outputs[0]?.label}
          onClickButton={(buttonValue) =>
            handleDataSubmit(nodeData?.node_id, buttonValue, "Trigger Button")
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
            handleDataSubmit(nodeData?.node_id, fields, "Text Input")
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
            handleDataSubmit(nodeData?.node_id, imageData, "Sketch Pad")
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
    case "audioRecorder":
      return (
        <AudioRecorder
          onSubmitAudio={(audioData: string) =>
            handleDataSubmit(nodeData?.node_id, audioData, "Audio Recorder")
          }
          loading={loading}
        />
      );
    case "camera":
      return (
        <Camera
          onPhotoSubmit={(photoData: string) =>
            handleDataSubmit(nodeData?.node_id, photoData, "Camera")
          }
          loading={loading}
        />
      );
    case "fileUpload":
      return (
        <FileUpload
          onUpload={(fileData: string) =>
            handleDataSubmit(nodeData?.node_id, fileData, "File Upload")
          }
          loading={loading}
        />
      );
    default:
      return <div>Unsupported component type: {component.type}</div>;
  }
};

export default RuntimeEngine;
