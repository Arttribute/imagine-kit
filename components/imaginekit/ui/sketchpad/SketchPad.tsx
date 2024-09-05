"use client";
import React, { useState, useRef, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import DrawingCanvas from "@/components/imaginekit/ui/sketchpad/DrawingCanvas";

interface SketchPadProps {
  onSubmit: (imageData: string) => void; // Callback function to handle submission
}

const SketchPad = forwardRef<HTMLCanvasElement, SketchPadProps>(
  ({ onSubmit }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Handle the submission of the drawing
    const handleSubmit = () => {
      if (canvasRef.current) {
        const imageData = canvasRef.current.toDataURL("image/png"); // Get image data as a data URL
        onSubmit(imageData); // Pass the image data to the callback
      }
    };

    return (
      <div className="h-96 w-96 m-2">
        <DrawingCanvas ref={canvasRef} />
        <Button className="w-full mt-2" onClick={handleSubmit}>
          Submit Drawing
        </Button>
      </div>
    );
  }
);

SketchPad.displayName = "SketchPad";

export default SketchPad;
