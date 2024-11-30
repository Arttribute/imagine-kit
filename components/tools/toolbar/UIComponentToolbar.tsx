"use client";
import React from "react";

const UIComponentToolbar: React.FC = () => {
  const uiComponents = [
    { id: "imgDisplay", label: "Image Display" },
    { id: "imageTiles", label: "Image Tiles" },
    { id: "sketchPad", label: "SketchPad" },
    { id: "textInput", label: "Text Input" },
    { id: "textOutput", label: "Text Output" },
    { id: "wordSelector", label: "Word Selector" },
    { id: "wordArranger", label: "Word Arranger" },
    { id: "flipCard", label: "Flip Card" },
    { id: "chatInterface", label: "Chat Interface" },
    { id: "triggerButton", label: "Trigger Button" },
    { id: "audioPlayer", label: "Audio Player" },
    { id: "audioRecorder", label: "Audio Recorder" },
    { id: "camera", label: "Camera" },
    { id: "fileUpload", label: "File Upload" },
    { id: "multiInputForm", label: "Multi Input Form" },
  ];

  return (
    <div className="w-48 p-4 bg-gray-100">
      <h3 className="text-lg font-semibold mb-3">UI Components</h3>
      {uiComponents.map((comp) => (
        <div
          key={comp.id}
          draggable
          className="p-2 bg-white border rounded mb-2 cursor-move"
        >
          {comp.label}
        </div>
      ))}
    </div>
  );
};

export default UIComponentToolbar;
