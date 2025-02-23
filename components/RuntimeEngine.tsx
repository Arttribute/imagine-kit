"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // For generating execution IDs

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
import MultiInputForm from "@/components/imaginekit/ui/multiinputform/MultiInputForm";

// Utility function for calling APIs
import { callGPTApi } from "@/utils/apicalls/gpt";
import { callDalleApi } from "@/utils/apicalls/dalle";
import { callTTSApi } from "@/utils/apicalls/opentts";
import { callWhisperApi } from "@/utils/apicalls/whisper";

// Types for node, edge, and UI component data
interface InputData {
  id: string;
  label: string;
  value: string;
  executionId?: string;
}

interface OutputData {
  id: string;
  label: string;
  value: string;
  executionId?: string;
}

interface NodeData {
  node_id: string;
  type: string;
  name: string;
  data: {
    inputs: InputData[];
    outputs: OutputData[];
    knowledgeBase?: {
      name: string;
      content: string;
    };
    instruction?: string;
    memoryFields?: { id: string; label: string; value: string }[];
    memory?: { inputs: string; outputs: string }[];
    context?: string;
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

// Helper functions to filter out base64 file content from memory
const filterBase64Content = (value: string): string => {
  if (value && value.startsWith("data:") && value.includes("base64,")) {
    return "[File content omitted]";
  }
  return value;
};

const filterBase64FromObject = (obj: any): any => {
  const newObj: any = {};
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      newObj[key] = filterBase64Content(obj[key]);
    } else {
      newObj[key] = obj[key];
    }
  }
  return newObj;
};

const RuntimeEngine: React.FC<RuntimeEngineProps> = ({ appId }) => {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [edges, setEdges] = useState<EdgeData[]>([]);
  const [uiComponents, setUIComponents] = useState<UIComponentData[]>([]);
  const [nodeExecutionStack, setNodeExecutionStack] = useState<
    { nodeId: string; executionId: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingWorldComponents, setLoadingWorldComponents] =
    useState<boolean>(false);
  const loadingCounter = useRef(0);

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
      } catch (error) {
        console.error("Failed to fetch data for runtime engine:", error);
      }
    };

    fetchData();
  }, [appId]);

  const insertGeneratedContent = (
    contentType: string,
    contentData: string,
    attributes?: Record<string, string>
  ) => {
    window.parent.postMessage(
      {
        type: "INSERT_IN_PAGE",
        payload: {
          type: contentType,
          data: contentData,
          attributes, // optional
        },
      },
      "*"
    );
  };

  // Function to execute a single node based on its type
  const executeNode = useCallback(
    async (node: NodeData, executionId: string) => {
      removeNodeFromStack(node.node_id, executionId);

      // Increment loading counter
      loadingCounter.current += 1;
      setLoading(true);

      try {
        console.log(
          `Executing node ${node.node_id} with executionId ${executionId}:`,
          node
        );
        switch (node.type) {
          case "llm":
            await executeLLMNode(node, executionId); // Execute LLM Node
            break;
          case "imageGen":
            await executeImageGeneratorNode(node, executionId); // Execute Image Generator Node
            break;
          case "textToSpeech":
            await executeTextToSpeechNode(node, executionId); // Execute Text to Speech Node
            break;
          case "speechToText":
            await executeSpeechToTextNode(node, executionId); // Execute Speech to Text Node
            break;
          case "textInput":
            executeTextInputNode(node, executionId); // Handle Text Input Node
            break;
          case "triggerButton":
            executeTriggerButtonNode(node, executionId); // Execute Trigger Button Node
            break;
          case "sketchPad":
            executeSketchPadNode(node, executionId); // Execute Sketch Pad Node
            break;
          case "audioRecorder":
            executeAudioRecorderNode(node, executionId); // Execute Audio Recorder Node
            break;
          case "camera":
            executeCameraNode(node, executionId); // Execute Camera Node
            break;
          case "fileUpload":
            executeFileUploadNode(node, executionId); // Execute File Upload Node
            break;
          case "multiInputForm":
            executeMultiInputFormNode(node, executionId); // Execute Multi Input Form Node
            break;
          default:
            console.warn(`Unknown node type: ${node.type}`);
            break;
        }
      } finally {
        // Decrement loading counter
        loadingCounter.current -= 1;
        if (loadingCounter.current === 0) {
          setLoading(false);
        }
      }
    },
    [nodes, edges]
  );

  const runExecutionStack = useCallback(async () => {
    const nodesToExecute = [...nodeExecutionStack];
    for (const { nodeId, executionId } of nodesToExecute) {
      const node = nodes.find((n) => n.node_id === nodeId);
      if (node) {
        await executeNode(node, executionId);
      }
    }
  }, [nodeExecutionStack, nodes, executeNode]);

  const addNodeToStack = (node: NodeData, executionId: string) => {
    setNodeExecutionStack((prev) => {
      if (
        !prev.find(
          (item) =>
            item.nodeId === node.node_id && item.executionId === executionId
        )
      ) {
        console.log(
          `Adding node ${node.node_id} to stack with executionId ${executionId}`
        );
        return [...prev, { nodeId: node.node_id, executionId }];
      }
      return prev;
    });
  };

  const removeNodeFromStack = (nodeId: string, executionId: string) => {
    console.log(
      `Removing node ${nodeId} from stack with executionId ${executionId}`
    );
    setNodeExecutionStack((prev) =>
      prev.filter(
        (item) => !(item.nodeId === nodeId && item.executionId === executionId)
      )
    );
  };

  const runApp = useCallback(async () => {
    await runExecutionStack();
  }, [runExecutionStack]);

  useEffect(() => {
    console.log("Node execution stack:", nodeExecutionStack);
    if (nodeExecutionStack.length > 0) {
      runApp();
    }
  }, [runApp, nodeExecutionStack]);

  const propagateDataToConnectedNodes = (
    node: NodeData,
    executionId: string
  ) => {
    const connectedEdges = edges.filter((edge) => edge.source === node.node_id);

    // Use functional state update to ensure we're working with the latest state
    setNodes((prevNodes) => {
      let updatedNodes = [...prevNodes];
      const nodesToAddToStack: NodeData[] = [];

      connectedEdges.forEach((edge) => {
        const targetNodeIndex = updatedNodes.findIndex(
          (n) => n.node_id === edge.target
        );

        if (targetNodeIndex !== -1) {
          const targetNode = updatedNodes[targetNodeIndex];
          const targetInputIndex = targetNode.data.inputs.findIndex(
            (input) => input.id === edge.targetHandle
          );

          if (targetInputIndex !== -1) {
            const inputLabel = targetNode.data.inputs[targetInputIndex].label;

            // Find the output that matches this label
            const outputValue = node.data.outputs.find(
              (output) => output.label === inputLabel
            )?.value;

            // If no matching label, use the first output value
            const newValue = outputValue ?? node.data.outputs[0]?.value;

            if (newValue !== undefined) {
              updatedNodes[targetNodeIndex] = {
                ...targetNode,
                data: {
                  ...targetNode.data,
                  inputs: targetNode.data.inputs.map((input, idx) =>
                    idx === targetInputIndex
                      ? { ...input, value: newValue, executionId }
                      : input
                  ),
                },
              };
              nodesToAddToStack.push(updatedNodes[targetNodeIndex]);
            }
          }
        }
      });

      // After all updates, add connected nodes to the execution stack
      nodesToAddToStack.forEach((updatedNode) => {
        addNodeToStack(updatedNode, executionId);
      });

      return updatedNodes;
    });
  };

  // Function to execute a Trigger Button Node
  const executeTriggerButtonNode = (node: NodeData, executionId: string) => {
    propagateDataToConnectedNodes(node, executionId);
    // Reset the button value
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
  const executeLLMNode = async (node: NodeData, executionId: string) => {
    const promptInput = node.data.inputs[0]?.value || "start";
    const promptLabel = node.data.inputs[0]?.label;
    if (!promptInput || promptInput === promptLabel) return;

    const { instruction, inputs, outputs, knowledgeBase } = node.data;
    let externalContextText = "";
    let externalContextSnapshot = "";

    // Check if the page is embedded in an iframe
    if (window.self !== window.top) {
      window.parent.postMessage({ type: "REQUEST_PAGE_CONTEXT" }, "*");

      const getPageContext = () => {
        return new Promise<string>((resolve) => {
          function handleMessage(event: MessageEvent) {
            if (event.data?.type === "PAGE_CONTEXT_RESPONSE") {
              const pageText = event.data.pageText;
              const pageSnapshot = event.data.pageSnapshot;
              const pageContext = { pageText, pageSnapshot };
              console.log(
                "[ImagineKit] Got page context of length:",
                pageText.length
              );
              console.log("[ImagineKit] Page context:", pageText);
              window.removeEventListener("message", handleMessage); // Clean up the event listener
              resolve(JSON.stringify(pageContext));
            }
          }
          window.addEventListener("message", handleMessage);
        });
      };

      try {
        const pageContext = JSON.parse(await getPageContext());
        externalContextText = pageContext.pageText;
        externalContextSnapshot = pageContext.pageSnapshot;
      } catch (error) {
        console.error("Error getting external context:", error);
      }

      console.log("[ImagineKit] External context:", externalContextText);
      console.log(
        "[ImagineKit] External context snapshot:",
        externalContextSnapshot
      );
    }

    const inputOutputMemory = node.data.memory;
    const currentInputValues = inputs.map((input) => input.value).join(" ");
    const outputFormat = outputs.map((output) => output.label).join(", ");
    const knowledgeBaseContent = knowledgeBase?.content || "";

    try {
      const generatedOutput = await callGPTApi(
        instruction ?? "",
        currentInputValues,
        externalContextText,
        externalContextSnapshot,
        outputFormat,
        JSON.stringify(inputOutputMemory ?? []),
        knowledgeBaseContent
      );

      const outputData = JSON.parse(generatedOutput);
      console.log(
        `Generated output for LLM Node (${node.node_id}):`,
        outputData
      );
      // Update the node's memory with the current input and output
      // Filter out base64 file strings before storing in memory
      const filteredInput = filterBase64Content(currentInputValues);
      const filteredOutput = filterBase64FromObject(outputData);
      const updatedMemory = [
        ...(node.data.memory ?? []),
        {
          inputs: filteredInput,
          outputs: filteredOutput,
        },
      ];

      const updatedOutputs = outputs.map((output) => ({
        ...output,
        value: outputData[output.label],
        executionId,
      }));

      const nodeIndex = nodes.findIndex((n) => n.node_id === node.node_id);
      if (nodeIndex !== -1) {
        const updatedNodes = [...nodes];
        updatedNodes[nodeIndex] = {
          ...node,
          data: {
            ...node.data,
            memory: updatedMemory,
            outputs: updatedOutputs,
          },
        };
        setNodes(updatedNodes);

        // Propagate data to connected nodes
        propagateDataToConnectedNodes(updatedNodes[nodeIndex], executionId);
      }
    } catch (error) {
      console.error(`Error executing LLM Node (${node.node_id}):`, error);
    }
  };

  const executeImageGeneratorNode = async (
    node: NodeData,
    executionId: string
  ) => {
    const promptInput = node.data.inputs[0]?.value;
    const promptLabel = node.data.inputs[0]?.label;
    if (!promptInput || promptInput === promptLabel) return;

    try {
      const generatedImageUrl = await callDalleApi(promptInput);

      const updatedOutputs = node.data.outputs.map((output) =>
        output.id === "output-0"
          ? { ...output, value: generatedImageUrl, executionId }
          : output
      );

      const nodeIndex = nodes.findIndex((n) => n.node_id === node.node_id);
      if (nodeIndex !== -1) {
        const updatedNodes = [...nodes];
        updatedNodes[nodeIndex] = {
          ...node,
          data: {
            ...node.data,
            outputs: updatedOutputs,
          },
        };
        setNodes(updatedNodes);

        propagateDataToConnectedNodes(updatedNodes[nodeIndex], executionId);
      }
    } catch (error) {
      console.error(
        `Error executing Image Generator Node (${node.node_id}):`,
        error
      );
    }
  };

  const executeTextToSpeechNode = async (
    node: NodeData,
    executionId: string
  ) => {
    const textInput = node.data.inputs[0]?.value;
    const textLabel = node.data.inputs[0]?.label;
    if (!textInput || textInput === textLabel) return;

    try {
      const generatedAudio = (await callTTSApi(textInput)) as string;

      // Create updated outputs with the new audio and executionId
      const updatedOutputs = node.data.outputs.map((output) =>
        output.id === "output-0"
          ? { ...output, value: generatedAudio, executionId }
          : output
      );

      // Find the index of the current node
      const nodeIndex = nodes.findIndex((n) => n.node_id === node.node_id);
      if (nodeIndex !== -1) {
        // Create a copy of nodes and update the current node
        const updatedNodes = [...nodes];
        updatedNodes[nodeIndex] = {
          ...node,
          data: {
            ...node.data,
            outputs: updatedOutputs,
          },
        };

        // Update the state with the new nodes array
        setNodes(updatedNodes);

        // Call propagateDataToConnectedNodes with the updated node
        propagateDataToConnectedNodes(updatedNodes[nodeIndex], executionId);
      }
    } catch (error) {
      console.error(
        `Error executing Text to Speech Node (${node.node_id}):`,
        error
      );
    }
  };

  const executeSpeechToTextNode = async (
    node: NodeData,
    executionId: string
  ) => {
    const audioInput = node.data.inputs[0]?.value;
    const audioLabel = node.data.inputs[0]?.label;
    if (!audioInput || audioInput === audioLabel) return;

    try {
      const generatedText = await callWhisperApi(audioInput);

      const updatedOutputs = node.data.outputs.map((output) =>
        output.id === "output-0"
          ? { ...output, value: generatedText, executionId }
          : output
      );

      const nodeIndex = nodes.findIndex((n) => n.node_id === node.node_id);
      if (nodeIndex !== -1) {
        const updatedNodes = [...nodes];
        updatedNodes[nodeIndex] = {
          ...node,
          data: {
            ...node.data,
            outputs: updatedOutputs,
          },
        };
        setNodes(updatedNodes);

        propagateDataToConnectedNodes(updatedNodes[nodeIndex], executionId);
      }
    } catch (error) {
      console.error(
        `Error executing Speech to Text Node (${node.node_id}):`,
        error
      );
    }
  };

  const executeMultiInputFormNode = (node: NodeData, executionId: string) => {
    propagateDataToConnectedNodes(node, executionId);
  };

  const executeSketchPadNode = (node: NodeData, executionId: string) => {
    propagateDataToConnectedNodes(node, executionId);
  };

  const executeTextInputNode = (node: NodeData, executionId: string) => {
    propagateDataToConnectedNodes(node, executionId);
  };

  const executeAudioRecorderNode = (node: NodeData, executionId: string) => {
    propagateDataToConnectedNodes(node, executionId);
  };

  const executeCameraNode = (node: NodeData, executionId: string) => {
    propagateDataToConnectedNodes(node, executionId);
  };

  const executeFileUploadNode = (node: NodeData, executionId: string) => {
    propagateDataToConnectedNodes(node, executionId);
  };

  const handleDataSubmit = (
    nodeId: string,
    data: string | Array<{ label: string; value: string }>,
    nodeName: string
  ) => {
    const executionId = uuidv4(); // Generate a unique execution ID

    setNodes((prevNodes) => {
      const nodeIndex = prevNodes.findIndex((n) => n.node_id === nodeId);
      if (nodeIndex !== -1) {
        const node = prevNodes[nodeIndex];
        const updatedOutputs = Array.isArray(data)
          ? data.map(({ label, value }) => ({
              id: label,
              label,
              value,
              executionId, // Include execution ID
            }))
          : [
              {
                ...node.data.outputs[0],
                value: data,
                executionId, // Include execution ID
              },
            ];

        const updatedNodes = [...prevNodes];
        updatedNodes[nodeIndex] = {
          ...node,
          data: {
            ...node.data,
            outputs: updatedOutputs,
          },
        };

        addNodeToStack(updatedNodes[nodeIndex], executionId);
        console.log(`${nodeName} added to stack:`, updatedNodes[nodeIndex]);

        return updatedNodes;
      }
      return prevNodes;
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
      // Calculate the column by dividing x by columnWidth
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
        isMobile && "fixed left-0 right-0 items-center justify-center"
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
              style={
                isMobile
                  ? {
                      width: "100%",
                      marginBottom: "10px",
                    }
                  : {
                      position: "absolute",
                      left: position.x,
                      top: position.y,
                      width: position.width,
                      height: position.height,
                      marginBottom: "0",
                    }
              }
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
          <div style={{ position: "absolute", width: "80vw" }}>
            <LoadingWorld />
          </div>
        )}
        {/* <div className="flex gap-2">
          <button
            onClick={() =>
              insertGeneratedContent("text", "Hello from ImagineKit!")
            }
          >
            Insert Text
          </button>
          <button
            onClick={() =>
              insertGeneratedContent(
                "image",
                "https://gateway.pinata.cloud/ipfs/QmfVvGtkipxMK2Ex7QVG8uMXJXfrBTLAF4Cd5dfTVoFBWC",
                {
                  alt: "An iMgae of a scroll",
                  class: "inserted-image",
                }
              )
            }
          >
            Insert Image
          </button>
        </div>*/}
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
            executionId: input.executionId, // Pass executionId
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
    case "multiInputForm":
      return (
        <MultiInputForm
          fields={nodeData?.data.outputs.map((output: any) => ({
            id: output.id,
            label: output.label,
            type: output.type,
            value: "",
          }))}
          onSubmit={(fields) =>
            handleDataSubmit(nodeData?.node_id, fields, "Multi Input Form")
          }
          loading={loading}
        />
      );
    default:
      return <div>Unsupported component type: {component.type}</div>;
  }
};

export default RuntimeEngine;
