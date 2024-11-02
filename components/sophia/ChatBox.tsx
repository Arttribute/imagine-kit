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
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
import "reactflow/dist/style.css";

interface NodeDiagramProps {
  data: {
    nodes: any[];
    edges: any[];
  };
}

function NodeDiagram({ data }: NodeDiagramProps) {
  const { nodes, edges } = data;

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <ReactFlow nodes={nodes} edges={edges}>
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}

function ChatBox() {
  const [input, setInput] = useState("");
  const [filteredInteractionData, setFilteredInteractionData] = useState<any[]>(
    [
      {
        input_type: "text",
        user_message: "Hello",
        system_message: { text: "Hi, how can I help you?" },
      },
      {
        input_type: "text",
        user_message: "Can you suggest a node diagram for a simple flow?",
        system_message: {
          text: "Sure! Here's a simple node diagram for you.",
          node_diagram: {
            nodes: [
              { id: "1", data: { label: "Start" }, position: { x: 0, y: 0 } },
              {
                id: "2",
                data: { label: "Process" },
                position: { x: 150, y: 0 },
              },
              { id: "3", data: { label: "End" }, position: { x: 300, y: 0 } },
            ],
            edges: [
              { id: "e1-2", source: "1", target: "2", type: "smoothstep" },
              { id: "e2-3", source: "2", target: "3", type: "smoothstep" },
            ],
          },
        },
      },
      {
        input_type: "text",
        user_message: "Thanks! That looks great.",
        system_message: { text: "Glad I could help!" },
      },
    ]
  );
  const [loadingResponse, setLoadingResponse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [filteredInteractionData, loadingResponse]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  const onSubmit = () => {
    // Handle the submission and update filteredInteractionData
  };

  return (
    <>
      <div className="h-full m-1">
        <ScrollArea className="bg-slate-50 border border-indigo-200 rounded-xl p-2 h-full">
          {filteredInteractionData &&
            filteredInteractionData.map((interaction: any, index: number) => (
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
                    {interaction.system_message.node_diagram && (
                      <div className="mt-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">View Node Diagram</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Suggested Node Diagram</DialogTitle>
                              <DialogDescription>
                                Here's the node diagram suggested by Sophia.
                              </DialogDescription>
                            </DialogHeader>
                            <NodeDiagram
                              data={interaction.system_message.node_diagram}
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

          {loadingResponse && (
            <div className="flex justify-end">
              <div className="bg-blue-100 p-3 rounded-2xl shadow-sm max-w-full">
                <p className="text-sm text-gray-800">{input}</p>
              </div>
            </div>
          )}
          {loadingResponse && (
            <div className="flex flex-col items-start">
              <div className="flex justify-start">
                <div className="bg-white border rounded-2xl p-4 px-12 my-2 mx-auto w-full max-w-md shadow-sm ">
                  <LoadingChat />
                </div>
              </div>
            </div>
          )}
          {filteredInteractionData.length > 0 && <div ref={messagesEndRef} />}
        </ScrollArea>

        <div className="flex w-full space-x-2  mt-2">
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
