// Sophia.tsx
"use client";
import { useState, useEffect } from "react";
import ChatBox from "@/components/sophia/ChatBox";
import { Edge } from "reactflow";
import axios from "axios";

interface SophiaProps {
  nodes: any[];
  edges: Edge[];
  appData: any;
  setNodes: React.Dispatch<React.SetStateAction<any[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge<any>[]>>;
  saveToHistory: () => void;
}

export default function Sophia({
  nodes,
  edges,
  appData,
  setNodes,
  setEdges,
  saveToHistory,
}: SophiaProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [interactionData, setInteractionData] = useState<any[]>([]);

  const userId = appData?.owner?._id;
  const appId = appData?._id;

  const toggleDrawer = (): void => {
    setIsOpen(!isOpen);
  };

  // Fetch interactions when component mounts
  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const response = await axios.get("/api/buildchat", {
          params: {
            appId: appId,
            userId: userId,
          },
        });

        const interactions = response.data.map((interaction: any) => ({
          user_message: interaction.user_message,
          system_message: interaction.system_message,
        }));

        setInteractionData(interactions);
      } catch (error) {
        console.error("Error fetching interactions:", error);
      }
    };

    if (appId && userId) {
      fetchInteractions();
    }
  }, [appId, userId]);

  return (
    <div className="relative">
      <button
        onClick={toggleDrawer}
        className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        {isOpen ? "Close Assistant" : "Open Assistant"}
      </button>

      <div
        className={`fixed border border-indigo-400 bottom-0 right-4 w-80 max-w-md h-6/7 bg-white shadow-xl shadow-sky-800 rounded-t-xl transform transition-transform z-20 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <button
          onClick={toggleDrawer}
          className="absolute top-4 right-4 text-gray-600"
        >
          Close
        </button>
        <div className="p-2">
          <h2 className="text-lg font-bold">Sophia</h2>
          <ChatBox
            nodes={nodes}
            edges={edges}
            appData={appData}
            userId={userId}
            appId={appId}
            interactionData={interactionData}
            setInteractionData={setInteractionData}
            setNodes={setNodes}
            setEdges={setEdges}
            saveToHistory={saveToHistory}
          />
        </div>
      </div>
    </div>
  );
}
