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
  PowerIcon,
  Volume2Icon,
  AudioLinesIcon,
  SpeechIcon,
  MicIcon,
  AudioWaveformIcon,
  CameraIcon,
  FileIcon,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AppToolBarProps {
  addNewNode: any;
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
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <div
          onClick={onClick}
          className={`flex flex-col col-span-1 p-2 items-center justify-center border border-0.5 rounded cursor-pointer  bg-${color}-50 text-${color}-600`}
        >
          {icon}
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" align="center">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const ToolSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="flex flex-col gap-2 mt-2">
    <div className="flex items-center ">
      {icon}
      <p className="text-xs text-gray-800 font-semibold ml-1">{title}</p>
    </div>
    <div className="grid grid-cols-1 gap-1">{children}</div>
  </div>
);

const AppToolBar: React.FC<AppToolBarProps> = ({ addNewNode }) => {
  const buttons = [
    {
      section: "AI",
      icon: <Sparkles className="w-4 h-4 text-gray-600 ml-1" />,
      tools: [
        {
          icon: <Bot className="w-5 h-5" />,
          label: "AI assistant",
          type: "LLMNode",
          color: "blue",
        },
        {
          icon: <Sparkles className="w-5 h-5" />,
          label: "Image generator",
          type: "ImageGen",
          color: "purple",
        },
        {
          icon: <AudioLinesIcon className="w-5 h-5" />,
          label: "Text to speech",
          type: "TextToSpeech",
          color: "violet",
        },
        {
          icon: <AudioWaveformIcon className="w-5 h-5" />,
          label: "Speech to text",
          type: "SpeechToText",
          color: "indigo",
        },
      ],
    },
    // {
    //   section: "Logic",
    //   icon: <SlidersHorizontal className="w-3 h-3 text-gray-600 mt-1" />,
    //   tools: [
    //     {
    //       icon: <Brain className="w-5 h-5" />,
    //       label: "Memory",
    //       type: "Memory",
    //       color: "green",
    //     },
    //     {
    //       icon: <GitCompare className="w-5 h-5" />,
    //       label: "Compare",
    //       type: "Compare",
    //       color: "red",
    //     },
    //   ],
    // },
    {
      section: "UI",
      icon: <LayoutTemplate className="w-4 h-4 text-gray-600 ml-1" />,
      tools: [
        {
          icon: <ClipboardList className="w-5 h-5" />,
          label: "Multi-input Form",
          type: "MultiInputForm",
          color: "teal",
        },
        {
          icon: <PowerIcon className="w-5 h-5" />,
          label: "Button",
          type: "TriggerButton",
          color: "fuchsia",
        },
        {
          icon: <MessageSquare className="w-5 h-5" />,
          label: "Chat interface",
          type: "ChatInterface",
          color: "sky",
        },
        {
          icon: <ImageIcon className="w-5 h-5" />,
          label: "Image gisplay",
          type: "ImagesDisplay",
          color: "yellow",
        },
        {
          icon: <Keyboard className="w-5 h-5" />,
          label: "Text input field",
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
          icon: <PencilLine className="w-5 h-5" />,
          label: "Sketch pad",
          type: "SketchPad",
          color: "cyan",
        },
        {
          icon: <Volume2Icon className="w-5 h-5" />,
          label: "Audio player",
          type: "AudioPlayer",
          color: "indigo",
        },
        {
          icon: <MicIcon className="w-5 h-5" />,
          label: "Audio recorder",
          type: "AudioRecorder",
          color: "purple",
        },
        {
          icon: <CameraIcon className="w-5 h-5" />,
          label: "Camera",
          type: "Camera",
          color: "green",
        },
        {
          icon: <FileIcon className="w-5 h-5" />,
          label: "File upload",
          type: "FileUpload",
          color: "red",
        },
        {
          icon: <LayoutGrid className="w-5 h-5" />,
          label: "Image tiles",
          type: "ImageTiles",
          color: "teal",
        },
        {
          icon: <MousePointer className="w-5 h-5" />,
          label: "Word selector",
          type: "WordSelector",
          color: "pink",
        },
        {
          icon: <ShuffleIcon className="w-5 h-5" />,
          label: "Word arranger",
          type: "WordArranger",
          color: "indigo",
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
    <div className="p-2 bg-white rounded-lg shadow-lg shadow-indigo-300  border border-purple-300 m-4 w-16 h-[80vh]">
      <div className="hidden">
        bg-violet-50 text-violet-600 bg-blue-50 text-blue-600 bg-sky-50
        text-sky-600 bg-teal-50 text-teal-600 bg-cyan-50 text-cyan-600
        bg-yellow-50 text-yellow-600 bg-amber-50 text-amber-600 bg-indigo-50
        text-indigo-600 bg-fuchsia-50 text-fuchsia-600 bg-rose-50 text-rose-600
      </div>
      <div className="flex flex-col gap-4">
        {buttons
          .filter(({ section }) => section === "AI")
          .map(({ section, icon, tools }) => (
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
        <ScrollArea className="h-[46vh] -mr-3 pr-3">
          {buttons
            .filter(({ section }) => section === "UI")
            .map(({ section, icon, tools }) => (
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
        </ScrollArea>
      </div>
    </div>
  );
};

export default AppToolBar;
