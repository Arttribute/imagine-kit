"use client";
import React, { useState, useCallback, useEffect } from "react";
import Draggable from "react-draggable";
import SketchPadPreview from "@/components/imaginekit/previews/SkethPadPreview";
import ImagesDisplayPreview from "@/components/imaginekit/previews/ImageDisplayPreview";
import WordSelectorPreview from "@/components/imaginekit/previews/WordSelectorPreview";
import ImageTilesPreview from "@/components/imaginekit/previews/IImageTilesPreview";
import WordArrangerPreview from "@/components/imaginekit/previews/WordArrangerPreview";
import TextInputPreview from "@/components/imaginekit/previews/TextInputPreview";
import TextOutputPreview from "@/components/imaginekit/previews/TextOutputPreview";
import ChatInterfacePreview from "@/components/imaginekit/previews/ChatInterfacePreview";
import FlipCardPreview from "@/components/imaginekit/previews/FlipCardPreview";
import TriggerButton from "@/components/imaginekit/previews/TriggerButtonPreview";
import AudioPlayerPreview from "@/components/imaginekit/previews/AudioPlayerPreview";
import AudioRecorderPreview from "@/components/imaginekit/previews/AudioRecorderPreview";
import CameraPreview from "@/components/imaginekit/previews/CameraPreview";
import FileUploadPreview from "@/components/imaginekit/previews/FileUploadPreview";
import MultiInputFormPreview from "../imaginekit/previews/MultiInputFormNodePreview";

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

interface UIPreviewProps {
  uiComponents: UIComponent[];
  savedPositions: { [key: string]: ComponentPosition };
  savePositions: (positions: { [key: string]: ComponentPosition }) => void;
}

const UIPreview: React.FC<UIPreviewProps> = ({
  uiComponents,
  savedPositions,
  savePositions,
}) => {
  const [positions, setPositions] = useState<{
    [key: string]: ComponentPosition;
  }>(savedPositions);

  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false); // Track unsaved changes

  // Calculate initial position based on the number of components to stack them vertically
  const calculateInitialPosition = (index: number): ComponentPosition => ({
    x: 10,
    y: 10 + index * 30,
    width: 200,
    height: 100,
  });

  const handleDrag = useCallback(
    (id: string, newX: number, newY: number) => {
      setPositions((prevPositions) => ({
        ...prevPositions,
        [id]: { ...prevPositions[id], x: newX, y: newY },
      }));
      setUnsavedChanges(true); // Mark changes as unsaved
    },
    [setPositions]
  );

  const handleResize = useCallback(
    (id: string, newWidth: number, newHeight: number) => {
      setPositions((prevPositions) => ({
        ...prevPositions,
        [id]: { ...prevPositions[id], width: newWidth, height: newHeight },
      }));
      setUnsavedChanges(true); // Mark changes as unsaved
    },
    [setPositions]
  );

  const handleStop = useCallback(() => {
    if (unsavedChanges) {
      savePositions(positions); // Save positions to the parent component
      setUnsavedChanges(false); // Reset unsaved changes flag after saving
    }
  }, [positions, savePositions, unsavedChanges]);

  // Auto-save mechanism to save positions at regular intervals (30 seconds)
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (unsavedChanges) {
        savePositions(positions);
        setUnsavedChanges(false); // Reset unsaved changes flag after saving
      }
    }, 30000); // 30 seconds

    return () => clearInterval(saveInterval); // Clear interval on unmount
  }, [positions, savePositions, unsavedChanges]);

  // Mapping component types to their preview components
  const componentPreviews: { [key: string]: React.FC } = {
    sketchPad: SketchPadPreview,
    imageDisplay: ImagesDisplayPreview,
    wordSelector: WordSelectorPreview,
    imageTiles: ImageTilesPreview,
    textInput: TextInputPreview,
    textOutput: TextOutputPreview,
    wordArranger: WordArrangerPreview,
    chatInterface: ChatInterfacePreview,
    flipCard: FlipCardPreview,
    triggerButton: TriggerButton,
    audioPlayer: AudioPlayerPreview,
    audioRecorder: AudioRecorderPreview,
    camera: CameraPreview,
    fileUpload: FileUploadPreview,
    multiInputForm: MultiInputFormPreview,
  };

  return (
    <div className="border h-full w-full rounded-xl">
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
                borderRadius: "10px",
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

export default UIPreview;
