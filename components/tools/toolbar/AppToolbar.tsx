// components/AppToolBar.tsx
"use client";
import React from "react";

interface AppToolBarProps {
  addNewNode: (type: string) => void;
}

const AppToolBar: React.FC<AppToolBarProps> = ({ addNewNode }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-xl border  m-4">
      <h2 className="text-lg font-bold mb-2">AppToolBar</h2>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => addNewNode("LLMNode")}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Add LLM Node
        </button>
        <button
          onClick={() => addNewNode("ImageGen")}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Add Image Generator
        </button>
        <button
          onClick={() => addNewNode("ImagesDisplay")}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Add Images Display
        </button>
        <button
          onClick={() => addNewNode("ImageTiles")}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Add Image Tiles
        </button>
        <button
          onClick={() => addNewNode("WordSelector")}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Add Word Selector
        </button>
        <button
          onClick={() => addNewNode("SketchPad")}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Add SketchPad
        </button>
        <button
          onClick={() => addNewNode("Compare")}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Add Compare
        </button>
        <button
          onClick={() => addNewNode("TextInput")}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Add Text Input
        </button>
        <button
          onClick={() => addNewNode("TextOutput")}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Add Text Output
        </button>
        <button
          onClick={() => addNewNode("WordArranger")}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Add Word Arranger
        </button>
        <button
          onClick={() => addNewNode("FlipCard")}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Add Flip Card
        </button>
        <button
          onClick={() => addNewNode("ChatInterface")}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Add Chat Interface
        </button>
        <button
          onClick={() => addNewNode("MemoryNode")}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Add Memory Node
        </button>
      </div>
    </div>
  );
};

export default AppToolBar;
