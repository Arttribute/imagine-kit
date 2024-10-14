"use client";
import React, { useEffect, useRef, useState, forwardRef } from "react";
import DrawingCanvas from "@/components/imaginekit/ui/sketchpad/DrawingCanvas";
import { CircleCheckBigIcon } from "lucide-react";

interface SketchPadProps {
  setImageData: (imageData: string) => void; // Callback function to handle submission
}

const SketchPad = forwardRef<HTMLCanvasElement, SketchPadProps>(
  ({ setImageData }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isCanvasDirty, setIsCanvasDirty] = useState(false); // Track if canvas has changes

    const onSubmit = () => {
      const originalCanvas = canvasRef.current;
      if (!originalCanvas) return;
      const originalContext = originalCanvas.getContext("2d");
      if (!originalContext) return;
      // Create a new canvas with the same dimensions
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = originalCanvas.width;
      tempCanvas.height = originalCanvas.height;
      const tempContext = tempCanvas.getContext("2d");
      if (!tempContext) return;
      // Fill the new canvas with a white background
      tempContext.fillStyle = "#ffffff"; // White color
      tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

      // Draw the original canvas content on top of the white background
      tempContext.drawImage(originalCanvas, 0, 0);

      const imageData = tempCanvas.toDataURL();
      setImageData(imageData);
      setIsCanvasDirty(false);
    };

    // Add event listeners to detect drawing on the canvas
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const handleMouseDown = () => setIsCanvasDirty(true);
      const handleTouchStart = () => setIsCanvasDirty(true);

      canvas.addEventListener("mousedown", handleMouseDown);
      canvas.addEventListener("touchstart", handleTouchStart);

      return () => {
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("touchstart", handleTouchStart);
      };
    }, []);

    return (
      <div className="w-96 m-2">
        <div className="h-96 mb-16">
          <DrawingCanvas
            ref={canvasRef}
            isCanvasDirty={isCanvasDirty}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    );
  }
);

SketchPad.displayName = "SketchPad";

export default SketchPad;

// const onSubmit = () => {
//   const originalCanvas = canvasRef.current;
//   if (!originalCanvas) return;
//   const originalContext = originalCanvas.getContext("2d");
//   if (!originalContext) return;
//   // Create a new canvas with the same dimensions
//   const tempCanvas = document.createElement("canvas");
//   tempCanvas.width = originalCanvas.width;
//   tempCanvas.height = originalCanvas.height;
//   const tempContext = tempCanvas.getContext("2d");
//   if (!tempContext) return;
//   // Fill the new canvas with a white background
//   tempContext.fillStyle = "#ffffff"; // White color
//   tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

//   // Draw the original canvas content on top of the white background
//   tempContext.drawImage(originalCanvas, 0, 0);

//   tempCanvas.toBlob(async (blob) => {
//     if (!blob) return;
//     const data = new FormData();
//     data.append("file", blob, "drawing.png");
//     data.append("upload_preset", "studio-upload");
//     const res = await axios.post(
//       "https://api.cloudinary.com/v1_1/arttribute/upload",
//       data
//     );
//     const uploadedFile = res.data;
//     setImageData(uploadedFile.secure_url);
//     setIsCanvasDirty(false);
//   });
// };
