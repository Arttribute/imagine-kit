"use client";
import React, { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import LoadingChat from "@/components/sophia/LoadingChat";
import { LoaderPinwheel } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ReactFlow, { Controls, Background, Edge } from "reactflow";
import "reactflow/dist/style.css";
import NodeDiagram from "../worlds/NodeDiagram";

interface ChatBoxProps {
  nodes: any[];
  edges: Edge[];
  uiComponents: any[];
  appData: any;
  userId: string;
  appId: string;
  interactionData: any[];
  setInteractionData: React.Dispatch<React.SetStateAction<any[]>>;
  setNodes: React.Dispatch<React.SetStateAction<any[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge<any>[]>>;
  saveToHistory: () => void;
}

function ChatBox({
  nodes,
  edges,
  uiComponents,
  appData,
  userId,
  appId,
  interactionData,
  setInteractionData,
  setNodes,
  setEdges,
  saveToHistory,
}: ChatBoxProps) {
  const [input, setInput] = useState("");
  const [userInputLoadingPlaceholder, setUserInputLoadingPlaceholder] =
    useState("");
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [diagramLoading, setDiagramLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState<number | null>(null); // Track index for dialog
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    console.log("ChatInteractions", interactionData);
  }, [interactionData, loadingResponse, diagramLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  const onSubmit = async () => {
    if (input.trim() === "") return;
    if (!userId || !appId) {
      console.error("User ID or App ID is missing.");
      return;
    }
    setUserInputLoadingPlaceholder(input);
    setLoadingResponse(true);
    setDiagramLoading(false);

    // Append the user message and create an empty system message (to be streamed)
    setInteractionData((prevData) => [
      ...prevData,
      {
        user_message: currentUserInput,
        system_message: { text: "" },
        diagramLoading: false,
        messageLoading: true,
      },
    ]);

    const currentUserInput = input;
    setInput("");

    let fullResponse = "";
    let diagramStarted = false;
    try {
      const response = await fetch("/api/sophia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentUserInput,
          interactionData,
          nodes,
          edges,
          uiComponents,
          appData,
        }),
      });

      if (!response.body) {
        throw new Error("No response body");
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        fullResponse += chunkValue;

        // Detect if node diagram section has begun streaming
        if (!diagramStarted && fullResponse.includes('"node_diagram":')) {
          diagramStarted = true;
          setDiagramLoading(true);
          // Stop appending further tokens to the text portion.
          const index = fullResponse.indexOf('"node_diagram":');
          const textPart = fullResponse.substring(0, index);
          setInteractionData((prevData) => {
            const updated = [...prevData];
            const lastIndex = updated.length - 1;
            updated[lastIndex] = {
              ...updated[lastIndex],
              system_message: { text: textPart.slice(13, -5) },
              diagramLoading: true,
              messageLoading: false,
            };
            return updated;
          });
        }

        // If diagram hasn't started, update the explanation text in real time
        if (!diagramStarted) {
          setInteractionData((prevData) => {
            const updated = [...prevData];
            const lastIndex = updated.length - 1;
            updated[lastIndex] = {
              ...updated[lastIndex],
              system_message: { text: fullResponse.slice(13, -5) },
            };
            return updated;
          });
        }
      }

      // Once the streaming finishes, try parsing the full response JSON
      try {
        const parsedResponse = JSON.parse(fullResponse);
        // Replace the current system message with the parsed response (which contains text and node_diagram)
        setInteractionData((prevData) => {
          const updated = [...prevData];
          const lastIndex = updated.length - 1;
          updated[lastIndex] = {
            ...updated[lastIndex],
            system_message: parsedResponse,
            diagramLoading: false,
          };
          return updated;
        });
        setDiagramLoading(false);
      } catch (e) {
        console.error("Failed to parse streamed response as JSON:", e);
      }

      const parsedResponse = JSON.parse(fullResponse);
      // Save the complete interaction to the history

      // Map node.node_id to node.id
      const newNodes = parsedResponse.node_diagram.nodes.map((node: any) => ({
        ...node,
        id: node.node_id,
      }));

      const interactionToSave = {
        owner: userId,
        app_id: appId,
        user_message: currentUserInput,
        system_message: {
          text: parsedResponse.text,
          node_diagram: {
            nodes: newNodes,
            edges: parsedResponse.node_diagram.edges,
          },
        },
      };

      // Apply changes to the node diagram
      if (
        parsedResponse.node_diagram &&
        parsedResponse.node_diagram.nodes &&
        parsedResponse.node_diagram.nodes.length > 0
      ) {
        // Map node.node_id to node.id
        const newNodes = parsedResponse.node_diagram.nodes.map((node: any) => ({
          ...node,
          id: node.node_id,
        }));
        const newEdges = parsedResponse.node_diagram.edges;
        setNodes(newNodes);
        setEdges(newEdges);
        console.log("Node Diagram", parsedResponse.node_diagram);
        saveToHistory();
      }

      await fetch("/api/buildchat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interactionData: interactionToSave }),
      });
    } catch (error) {
      console.error("Error communicating with Sophia:", error);
    } finally {
      setLoadingResponse(false);
    }
  };

  const handleAcceptSuggestion = (systemMessage: any) => {
    if (systemMessage.node_diagram) {
      // Map node.node_id to node.id
      const newNodes = systemMessage.node_diagram.nodes.map((node: any) => ({
        ...node,
        id: node.node_id,
      }));
      const newEdges = systemMessage.node_diagram.edges;
      setNodes(newNodes);
      setEdges(newEdges);
      setOpenDialog(null); // Close the dialog
      saveToHistory();
    }
  };

  return (
    <>
      <div className="h-full">
        <ScrollArea className="bg-slate-50 rounded-xl p-2 h-[74vh]">
          {interactionData &&
            interactionData.map((interaction: any, index: number) => (
              <div key={index} className="mb-4">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-sky-50 border-blue-100 p-3 rounded-2xl max-w-full">
                    <p className="text-sm text-gray-800">
                      {interaction.user_message}
                    </p>
                  </div>
                </div>

                {/* System Message */}
                <div className="flex justify-start mt-4">
                  <div className="bg-white rounded-2xl p-4 px-5 shadow-sm max-w-full">
                    <p className="text-sm text-gray-700">
                      {interaction.system_message.text}
                    </p>
                    {/* If message is loading, show spinner instead of streaming raw JSON */}
                    {interaction.messageLoading && (
                      <div className="flex items-center space-x-2 mt-2">
                        <LoaderPinwheel className="w-4 h-4 animate-spin text-indigo-600 mr-2 -mt-2" />
                      </div>
                    )}
                    {/* If diagram is loading, show spinner instead of streaming raw JSON */}
                    {interaction.diagramLoading && (
                      <div className="flex items-center space-x-2 mt-2">
                        <LoaderPinwheel className="w-4 h-4 animate-spin text-indigo-600 mr-2" />
                        <span className="text-sm text-gray-600">
                          Generating nodes...
                        </span>
                      </div>
                    )}
                    {/* If a node diagram exists (and streaming is complete), show the dialog trigger */}
                    {interaction.system_message.node_diagram &&
                      interaction.system_message.node_diagram.nodes &&
                      interaction.system_message.node_diagram.nodes.length >
                        0 && (
                        <div className="mt-2">
                          <Dialog
                            open={openDialog === index}
                            onOpenChange={(isOpen) =>
                              setOpenDialog(isOpen ? index : null)
                            }
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                onClick={() => setOpenDialog(index)}
                                className="rounded-lg border border-indigo-300 text-indigo-700 hover:text-indigo-800"
                              >
                                App Logic
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Suggested Flow</DialogTitle>
                                <DialogDescription>
                                  {
                                    "Here's the suggested flow based on your conversation."
                                  }
                                </DialogDescription>
                              </DialogHeader>
                              <NodeDiagram
                                data={interaction.system_message.node_diagram}
                              />
                              <div className="flex justify-end mt-4 space-x-2">
                                <Button
                                  variant="secondary"
                                  onClick={() =>
                                    handleAcceptSuggestion(
                                      interaction.system_message
                                    )
                                  }
                                >
                                  Apply Changes
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))}

          {interactionData.length > 0 && <div ref={messagesEndRef} />}
        </ScrollArea>

        <div className="flex w-full space-x-2 mt-2">
          <Input
            placeholder="Type your message here"
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={handleKeyDown}
            className="flex-grow rounded-xl p-5"
          />
          <Button className="bg-indigo-500 rounded-xl px-3" onClick={onSubmit}>
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}

export default ChatBox;
