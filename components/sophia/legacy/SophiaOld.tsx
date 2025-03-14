// Sophia.tsx
"use client";
import { useState, useEffect } from "react";
import ChatBoxOld from "./ChatBoxOld";
import { Edge } from "reactflow";
import axios from "axios";
import { LightbulbIcon, ChevronDownIcon, LoaderPinwheel } from "lucide-react";

interface SophiaProps {
  nodes: any[];
  edges: Edge[];
  appData: any;
  setNodes: React.Dispatch<React.SetStateAction<any[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge<any>[]>>;
  saveToHistory: () => void;
}

export default function SophiaOld({
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
        className="fixed bottom-4 right-4 border border-indigo-500 bg-white px-4 py-2 rounded-lg shadow-lg shadow-sky-200"
      >
        <div className="flex items-center ">
          <LoaderPinwheel className="w-4 h-4 mr-1 text-indigo-600" />{" "}
          {isOpen ? (
            "Close Assistant"
          ) : (
            <div className="flex items-center">
              <p className="text-sm font-medium bg-gradient-to-r from-indigo-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                {"Build with Sophia"}{" "}
              </p>
            </div>
          )}
        </div>
      </button>

      <div
        className={`fixed border border-indigo-400 bottom-0 right-4 w-80 max-w-md h-6/7 bg-white shadow-xl shadow-sky-600 rounded-t-xl transform transition-transform z-20 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="p-2">
          <div className="flex justify-between items-center p-1">
            <div className="flex items-center">
              <LoaderPinwheel className="w-4 h-4 mr-1 text-indigo-600" />{" "}
              <h2 className="text-sm font-semibold bg-gradient-to-r from-indigo-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                Build with Sophia
              </h2>
            </div>
            <button
              onClick={toggleDrawer}
              className=" border rounded-lg p-1 top-1 right-3 text-gray-600"
            >
              <ChevronDownIcon className="w-5 h-5" />
            </button>
          </div>
          <ChatBoxOld
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
