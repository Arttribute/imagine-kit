// components/AppToolBar.tsx
"use client";
import React from "react";
import {
  Bot,
  Sparkles,
  SlidersHorizontal,
  Brain,
  GitCompare,
  ImageIcon,
  LayoutTemplate,
  LayoutGrid,
  MousePointer,
  PencilLine,
  Keyboard,
  AlignLeftIcon,
  ShuffleIcon,
  StickyNote,
  MessageSquare,
} from "lucide-react";

interface AppToolBarProps {
  addNewNode: (type: string) => void;
}

type ToolButtonProps = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color: string; // Base color (e.g., 'blue', 'purple')
};

const ToolButton: React.FC<ToolButtonProps> = ({
  icon,
  label,
  onClick,
  color,
}) => (
  <div
    onClick={onClick}
    className={`flex flex-col col-span-1 p-2 items-center justify-center border rounded cursor-pointer border-${color}-500 bg-${color}-50 text-${color}-600`}
  >
    {icon}
    <p className={`text-xs text-${color}-600`}>{label}</p>
  </div>
);

const ToolSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="flex flex-col gap-2 mt-2">
    <div className="flex items-center">
      {icon}
      <p className="text-sm text-gray-500 font-semibold ml-1">{title}</p>
    </div>
    <div className="grid grid-cols-2 gap-1">{children}</div>
  </div>
);

const AppToolBar: React.FC<AppToolBarProps> = ({ addNewNode }) => {
  const buttons = [
    {
      section: "Gen AI",
      icon: <Sparkles className="w-3 h-3 text-gray-600 mt-1" />,
      tools: [
        {
          icon: <Bot className="w-5 h-5" />,
          label: "Assistant",
          type: "LLMNode",
          color: "blue",
        },
        {
          icon: <Sparkles className="w-5 h-5" />,
          label: "ImageGen",
          type: "ImageGen",
          color: "purple",
        },
      ],
    },
    {
      section: "Logic",
      icon: <SlidersHorizontal className="w-3 h-3 text-gray-600 mt-1" />,
      tools: [
        {
          icon: <Brain className="w-5 h-5" />,
          label: "Memory",
          type: "Memory",
          color: "green",
        },
        {
          icon: <GitCompare className="w-5 h-5" />,
          label: "Compare",
          type: "Compare",
          color: "red",
        },
      ],
    },
    {
      section: "UI Elements",
      icon: <LayoutTemplate className="w-3 h-3 text-gray-600 mt-1" />,
      tools: [
        {
          icon: <ImageIcon className="w-5 h-5" />,
          label: "Display",
          type: "ImagesDisplay",
          color: "yellow",
        },
        {
          icon: <LayoutGrid className="w-5 h-5" />,
          label: "Image tiles",
          type: "ImageTiles",
          color: "teal",
        },
        {
          icon: <MousePointer className="w-5 h-5" />,
          label: "Selector",
          type: "WordSelector",
          color: "pink",
        },
        {
          icon: <ShuffleIcon className="w-5 h-5" />,
          label: "Arranger",
          type: "WordArranger",
          color: "indigo",
        },
        {
          icon: <Keyboard className="w-5 h-5" />,
          label: "Text Input",
          type: "TextInput",
          color: "gray",
        },
        {
          icon: <AlignLeftIcon className="w-5 h-5" />,
          label: "Text Output",
          type: "TextOutput",
          color: "orange",
        },
        {
          icon: <MessageSquare className="w-5 h-5" />,
          label: "Chat",
          type: "ChatInterface",
          color: "lime",
        },
        {
          icon: <PencilLine className="w-5 h-5" />,
          label: "Sketch pad",
          type: "SketchPad",
          color: "cyan",
        },
        {
          icon: <StickyNote className="w-5 h-5" />,
          label: "Flip card",
          type: "FlipCard",
          color: "rose",
        },
      ],
    },
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow-xl border m-4 w-64">
      <h2 className="text-lg font-bold mb-2">AppToolBar</h2>
      <div className="flex flex-col gap-4">
        {buttons.map(({ section, icon, tools }) => (
          <ToolSection key={section} title={section} icon={icon}>
            {tools.map(({ icon, label, type, color }) => (
              <ToolButton
                key={label}
                icon={icon}
                label={label}
                onClick={() => addNewNode(type)}
                color={color}
              />
            ))}
          </ToolSection>
        ))}
      </div>
    </div>
  );
};

export default AppToolBar;
