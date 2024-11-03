"use client";
import React, { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import LoadingChat from "@/components/sophia/LoadingChat";
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
import axios from "axios";
import nodeTypes from "@/components/imaginekit/nodes/nodeTypes";

interface NodeDiagramProps {
  data: {
    nodes: any[];
    edges: any[];
  };
}

interface ChatBoxProps {
  nodes: Node[];
  edges: Edge[];
  appData: any;
  userId: string;
  appId: string;
  interactionData: any[];
  setInteractionData: React.Dispatch<React.SetStateAction<any[]>>;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge<any>[]>>;
  saveToHistory: () => void;
}

function NodeDiagram({ data }: NodeDiagramProps) {
  const { nodes, edges } = data;

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes}>
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}

function ChatBox({
  nodes,
  edges,
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
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [interactionData, loadingResponse]);

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

    setLoadingResponse(true);

    try {
      // Send data to backend
      const response = await axios.post("/api/sophia", {
        message: input,
        interactionData: interactionData,
        nodes,
        edges,
        appData,
      });

      // The response data is a JSON string; we need to parse it
      const aiResponseText = response.data;

      let aiResponse;
      try {
        // Remove backticks and sanitize GPT output before parsing
        const cleanedOutput = aiResponseText
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
        aiResponse = JSON.parse(cleanedOutput);
      } catch (e) {
        console.error("Failed to parse AI response:", e);
        aiResponse = { text: aiResponseText };
      }

      // Update the interaction data in state
      setInteractionData((prevData) => [
        ...prevData,
        {
          user_message: input,
          system_message: aiResponse,
        },
      ]);

      // Save the interaction to the database
      const interactionToSave = {
        owner: userId,
        app_id: appId,
        user_message: input,
        system_message: aiResponse, // Save the entire system message object
      };

      await axios.post("/api/buildchat", {
        interactionData: interactionToSave,
      });

      setInput("");
    } catch (error) {
      console.error("Error communicating with Sophia:", error);
    } finally {
      setLoadingResponse(false);
    }
  };

  const handleAcceptSuggestion = (systemMessage: any) => {
    if (systemMessage.node_diagram) {
      const newNodes = systemMessage.node_diagram.nodes;
      const newEdges = systemMessage.node_diagram.edges;

      setNodes(newNodes);
      setEdges(newEdges);
      setOpenDialog(false);
      saveToHistory();
    }
  };

  return (
    <>
      <div className="h-full m-1">
        <ScrollArea className="bg-slate-50 border border-indigo-200 rounded-xl p-2 h-[70vh]">
          {interactionData &&
            interactionData.map((interaction: any, index: number) => (
              <div key={index} className="mb-4">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-blue-100 p-3 rounded-2xl shadow-sm max-w-full">
                    <p className="text-sm text-gray-800">
                      {interaction.user_message}
                    </p>
                  </div>
                </div>

                {/* System Message */}
                <div className="flex justify-start mt-4">
                  <div className="border bg-white rounded-2xl p-4 px-5 shadow-sm max-w-full">
                    <p className="text-sm text-gray-700">
                      {interaction.system_message.text}
                    </p>
                    {interaction.system_message.node_diagram &&
                      interaction.system_message.node_diagram.nodes.length >
                        0 && (
                        <div className="mt-2">
                          <Dialog
                            open={openDialog}
                            onOpenChange={setOpenDialog}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                onClick={() => setOpenDialog(true)}
                              >
                                View Node Diagram
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>
                                  Suggested Node Diagram
                                </DialogTitle>
                                <DialogDescription>
                                  {
                                    "Here's the node diagram suggested by Sophia."
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

          {loadingResponse && (
            <>
              <div className="flex justify-end">
                <div className="bg-blue-100 p-3 rounded-2xl shadow-sm max-w-full">
                  <p className="text-sm text-gray-800">{input}</p>
                </div>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex justify-start">
                  <div className="bg-white border rounded-2xl p-4 px-12 my-2 mx-auto w-full max-w-md shadow-sm ">
                    <LoadingChat />
                  </div>
                </div>
              </div>
            </>
          )}
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
          <Button className="bg-indigo-500 rounded-xl px-2" onClick={onSubmit}>
            <ArrowUp className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </>
  );
}

export default ChatBox;
