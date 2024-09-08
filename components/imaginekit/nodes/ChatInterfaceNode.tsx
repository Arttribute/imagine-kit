import React from "react";
import { MessageSquareMore, AlignLeftIcon, MessageSquare } from "lucide-react";
import BaseNode from "@/components/imaginekit/nodes/BaseNode";

interface ChatInterfaceNodeProps {
  data: {
    chatInterfaceName: string; // Name of the ChatInterfaceNode node
    inputs: { id: string; label: string; value: string }[]; // Inputs for the node
    onDataChange: (id: string, data: any) => void;
    onRemoveNode: (id: string) => void;
  };
  id: string;
}

const ChatInterfaceNode: React.FC<ChatInterfaceNodeProps> = ({ data, id }) => {
  const { chatInterfaceName, inputs, onDataChange, onRemoveNode } = data;

  return (
    <BaseNode
      id={id}
      name={chatInterfaceName}
      defaultName="Chat Interface"
      nameKey="chatInterfaceName"
      type="input"
      inputs={inputs}
      icon={
        <div className="flex items-center">
          <MessageSquare className="w-4 h-4 text-gray-400 mr-1" />
          <p className="text-xs text-gray-500">Chat</p>
        </div>
      }
      onDataChange={onDataChange}
      onRemoveNode={onRemoveNode}
    >
      <div className="w-full">
        <div className="relative bg-gray-50 flex rounded-lg border-2 p-2">
          <MessageSquareMore className="w-5 h-5 text-gray-400 mr-2" />
          <AlignLeftIcon className="w-5 h-5 text-gray-400 mr-2" />
          <p className="text-gray-400 text-sm">Chat Interface</p>
        </div>
      </div>
    </BaseNode>
  );
};

export default ChatInterfaceNode;
