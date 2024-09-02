"use client";
import React, { useState, useCallback } from "react";
import Draggable from "react-draggable";
import SketchPadPreview from "@/components/imaginekit/previews/SkethPadPreview";

interface ComponentPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface UIComponent {
  id: string;
  label: string;
  type: string; // Add type to determine which preview to show
}

interface UIEditorProps {
  uiComponents: UIComponent[];
  savedPositions: { [key: string]: ComponentPosition };
  savePositions: (positions: { [key: string]: ComponentPosition }) => void;
}

const UIEditor: React.FC<UIEditorProps> = ({
  uiComponents,
  savedPositions,
  savePositions,
}) => {
  const [positions, setPositions] = useState<{
    [key: string]: ComponentPosition;
  }>(savedPositions);

  // Calculate initial position based on the number of components to stack them vertically
  const calculateInitialPosition = (index: number): ComponentPosition => ({
    x: 50,
    y: 50 + index * 150, // Adjust the '150' value to change spacing between components
    width: 200,
    height: 100,
  });

  const handleDrag = useCallback(
    (id: string, newX: number, newY: number) => {
      setPositions((prevPositions) => ({
        ...prevPositions,
        [id]: { ...prevPositions[id], x: newX, y: newY },
      }));
    },
    [setPositions]
  );

  const handleResize = useCallback(
    (id: string, newWidth: number, newHeight: number) => {
      setPositions((prevPositions) => ({
        ...prevPositions,
        [id]: { ...prevPositions[id], width: newWidth, height: newHeight },
      }));
    },
    [setPositions]
  );

  const handleStop = useCallback(() => {
    savePositions(positions);
  }, [positions, savePositions]);

  // Mapping component types to their preview components
  const componentPreviews: { [key: string]: React.FC } = {
    sketchPad: SketchPadPreview,
  };

  return (
    <div
      style={{
        width: "50%",
        height: "100%",
        borderLeft: "1px solid #ddd",
        overflowY: "auto", // Add scrolling for overflow
        padding: "10px",
      }}
    >
      {uiComponents.map((component, index) => {
        const position =
          positions[component.id] || calculateInitialPosition(index);
        const PreviewComponent = componentPreviews[component.type];
        console.log("Component previews", componentPreviews); // Debugging log
        console.log("Component preview", PreviewComponent); // Debugging log
        console.log(`Rendering component: ${component.type}`); // Debugging log

        return (
          <Draggable
            key={component.id}
            position={{ x: position.x, y: position.y }}
            onDrag={(_, data) => handleDrag(component.id, data.x, data.y)}
            onStop={handleStop}
          >
            <div
              style={{
                position: "absolute",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                padding: "0px",
              }}
            >
              {PreviewComponent ? (
                <PreviewComponent />
              ) : (
                <div>No Preview for {component.type}</div>
              )}
            </div>
          </Draggable>
        );
      })}
    </div>
  );
};

export default UIEditor;
