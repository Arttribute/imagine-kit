import React from "react";
import { Pencil, Eraser, Undo, Redo } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ToolBarProps {
  handleDraw: () => void;
  handleErase: () => void;
  handleUndo: () => void;
  handleRedo: () => void;
  activeTool: "draw" | "erase";
  selectedColor: string;
  setSelectedColor: (color: string) => void;
}

const ToolBar: React.FC<ToolBarProps> = ({
  handleDraw,
  handleErase,
  handleUndo,
  handleRedo,
  activeTool,
  selectedColor,
  setSelectedColor,
}) => {
  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginTop: "8px",
          justifyContent: "center",
          marginBottom: "10px",
        }}
      >
        <div className="flex rounded-2xl m-2  border border-gray-300 p-1 shadow-lg px-3">
          <div className="flex items-center p-1">
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className=" w-7 h-8"
              style={{ borderRadius: "100%", border: "none" }}
            />
          </div>
          <Button
            onClick={handleDraw}
            variant="ghost"
            className={`rounded-xl px-3 ${
              activeTool === "draw"
                ? "bg-gray-200 hover:bg-gray-200"
                : "hover:bg-gray-200"
            }`}
          >
            <Pencil className="h-4 w-4 text-black" />
          </Button>
          <Button
            onClick={handleErase}
            variant="ghost"
            className={`rounded-xl px-3 ${
              activeTool === "erase"
                ? "bg-gray-200 hover:bg-gray-200"
                : "hover:bg-gray-200"
            }`}
          >
            <Eraser className="h-4 w-4 text-black" />
          </Button>
          <Button
            onClick={handleUndo}
            variant="ghost"
            className="rounded-xl px-3 hover:bg-gray-200"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleRedo}
            variant="ghost"
            className="rounded-xl px-3 hover:bg-gray-200"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default ToolBar;
