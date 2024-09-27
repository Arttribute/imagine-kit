"use client";
import React, { useState, useEffect, useRef } from "react";
import { MessageSquareIcon } from "lucide-react";
import LoadingChat from "./LoadingChat";

// Interface for interaction data
interface ChatInterfaceProps {
  interaction: Array<{
    id: string;
    label: string;
    value: string;
  }>;
  loading?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  interaction,
  loading,
}) => {
  const [interactionData, setInteractionData] = useState<
    Array<{ id: string; role: string; message: string }>
  >([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Predefined set of colors to assign to roles
  const colors = [
    "bg-sky-100",
    "bg-white",
    "bg-purple-100",
    "bg-fuchsia-100",
    "bg-lime-100",
    "bg-amber-100",
    "bg-rose-100",
    "bg-indigo-100",
  ];

  useEffect(() => {
    if (interaction && interaction.length > 0) {
      // Filter out interactions that already exist in the interactionData state
      const newInteractions = interaction.filter((i) => {
        return !interactionData.some(
          (data) => data.id === i.id && data.message === i.value
        );
      });

      // Map new interactions to the interactionData structure
      const mappedInteractions = newInteractions.map((i) => ({
        id: i.id,
        role: i.label, // Use label as the role
        message: i.value, // Use value as the message
      }));

      // Append new interactions to the existing interactionData state
      setInteractionData((prevData) => [...prevData, ...mappedInteractions]);
    }
  }, [interaction]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [interaction]);

  return (
    <div className="flex flex-col h-[60vh] w-96 m-2  border shadow-xl rounded-xl">
      <div className="bg-gray-50 border border-indigo-200 rounded-xl p-2 m-2 h-full overflow-y-auto">
        <div className="flex items-center text-indigo-500 mb-3">
          <MessageSquareIcon className="h-4 w-4 mr-1" />
          <p className="text-xs font-semibold">chat</p>
        </div>

        {interactionData &&
          interactionData.map((interaction, index) => {
            // Skip rendering if message is an empty string or message equals role
            if (
              !interaction.message ||
              interaction.message === interaction.role
            ) {
              return null;
            }

            return (
              <div key={index} className="mb-4 ">
                <div
                  className={`p-2 border border-gray-300 shadow-sm rounded-xl ${
                    colors[parseInt(interaction.id[6], 10) % 6]
                  }`}
                >
                  {interaction.message}
                </div>
              </div>
            );
          })}

        {loading && (
          <div className="flex justify-left">
            <div className="p-3  max-w-full">
              <LoadingChat />
            </div>
          </div>
        )}
        <div className="mb-8" />
        {interactionData.length > 0 && <div ref={messagesEndRef} />}
      </div>
    </div>
  );
};

export default ChatInterface;
