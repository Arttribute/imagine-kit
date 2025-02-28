// Sophia.tsx
"use client";
import { useState, useEffect } from "react";
import ChatBox from "@/components/sophia/ChatBox";
import { Edge } from "reactflow";
import axios from "axios";
import { Sparkles } from "lucide-react";
import Link from "next/link";

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
  const [interactionData, setInteractionData] = useState<any[]>([]);

  const userId = appData?.owner?._id;
  const appId = appData?._id;

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
    <div className="">
      <div
        className={`border border-indigo-300 bg-white shadow-xl shadow-sky-200 rounded-xl z-20`}
      >
        <Link href="/">
          <div className="flex pt-4 px-4 ">
            <p className="pb-1 whitespace-pre-wrap bg-gradient-to-r from-orange-500 via-pink-500 to-indigo-500 bg-clip-text text-lg text-center font-bold leading-none tracking-tighter text-transparent">
              Imagine kit
            </p>
            <Sparkles className="h-4 w-4 -mt-0.5 text-indigo-600" />
          </div>
        </Link>
        <div className="p-2">
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
