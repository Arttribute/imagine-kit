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
        {
          icon: <AudioLinesIcon className="w-5 h-5" />,
          label: "TTSpeech",
          type: "TextToSpeech",
          color: "pink",
        },
        {
          icon: <AudioWaveformIcon className="w-5 h-5" />,
          label: "SpeechTText",
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
      section: "UI Elements",
      icon: <LayoutTemplate className="w-3 h-3 text-gray-600 mt-1" />,
      tools: [
        {
          icon: <ClipboardList className="w-5 h-5" />,
          label: "Multi Form",
          type: "MultiInputForm",
          color: "blue",
        },
        {
          icon: <PowerIcon className="w-5 h-5" />,
          label: "Button",
          type: "TriggerButton",
          color: "green",
        },
        {
          icon: <MessageSquare className="w-5 h-5" />,
          label: "Chat",
          type: "ChatInterface",
          color: "red",
        },
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
        {
          icon: <Volume2Icon className="w-5 h-5" />,
          label: "Player",
          type: "AudioPlayer",
          color: "indigo",
        },
        {
          icon: <MicIcon className="w-5 h-5" />,
          label: "Recorder",
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
          label: "File Upload",
          type: "FileUpload",
          color: "red",
        },
      ],
    },
  ];

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg shadow-indigo-200  border border-purple-200 m-4 w-64">
      <Link href="/">
        <div className="flex  justify-center">
          <p className="p-1 whitespace-pre-wrap bg-gradient-to-r from-orange-500 via-pink-500 to-indigo-500 bg-clip-text text-center text-xl font-bold leading-none tracking-tighter text-transparent">
            Imagine kit
          </p>
          <Sparkles className="h-4 w-4 mt-0.5 text-indigo-500" />
        </div>
      </Link>
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
