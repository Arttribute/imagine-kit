"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  MicIcon,
  RefreshCcwIcon,
  CameraIcon,
  CirclePowerIcon,
  CloudUploadIcon,
  FileIcon,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import DrawingCanvas from "@/components/imaginekit/ui/sketchpad/DrawingCanvas";

interface Field {
  id: string;
  label: string;
  type: string;
  value: any;
}

interface MultiInputFormProps {
  fields: Field[];
  onSubmit: (fields: Field[]) => void; // Callback function
  loading?: boolean;
}

const MultiInputForm: React.FC<MultiInputFormProps> = ({
  fields,
  onSubmit,
  loading,
}) => {
  const [inputFields, setInputFields] = useState(
    fields.map((field) => ({ ...field }))
  );

  // Refs and states for various input types
  const audioRefs = useRef<{ [key: string]: any }>({});
  const cameraRefs = useRef<{ [key: string]: any }>({});
  const sketchRefs = useRef<{ [key: string]: any }>({});
  const fileRefs = useRef<{ [key: string]: any }>({});
  const textRefs = useRef<{ [key: string]: string }>({});

  const [isCanvasDirty, setIsCanvasDirty] = useState(false); // Track if canvas has changes

  const handleInputChange = (fieldId: string, value: any) => {
    setInputFields((prevFields) =>
      prevFields.map((field) =>
        field.id === fieldId ? { ...field, value } : field
      )
    );
    console.log("Input Fields", inputFields);
    console.log("Audio Refs", audioRefs.current);
    console.log("Camera Refs", cameraRefs.current);
    console.log("Sketch Refs", sketchRefs.current);
    console.log("File Refs", fileRefs.current);
    console.log("Text Refs", textRefs.current);
  };

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sketchPadRef = useRef<HTMLCanvasElement | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Start camera stream
  const startCamera = async () => {
    try {
      // Check if HTTPS is required
      if (
        window.location.protocol !== "https:" &&
        process.env.NODE_ENV === "production"
      ) {
        throw new Error("Camera access requires HTTPS in production.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use 'user' for the front camera
        audio: false,
      });
      if (videoRef.current) {
        console.log("Camera access granted.");
        videoRef.current.srcObject = stream;
      }
      setIsStreaming(true);
      setError(null);
    } catch (err) {
      console.error("Error accessing the camera", err);
      setError(
        "Unable to access the camera. Please check permissions and ensure you're using HTTPS."
      );
    }
  };

  const handleStartCamera = () => {
    setCameraStarted(true);
    startCamera();
  };

  const handleStopCamera = () => {
    setIsStreaming(false);
    (videoRef.current?.srcObject as MediaStream)
      ?.getTracks()
      .forEach((track) => {
        track.stop();
      });
    setCameraStarted(false);
  };

  useEffect(() => {
    startCamera();
    setCameraStarted(true);
  }, []);

  // Capture photo
  const takePhoto = (field: { id: string }) => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(
          videoRef.current,
          0,
          0,
          videoRef.current.videoWidth,
          videoRef.current.videoHeight
        );
        const photoData = canvasRef.current.toDataURL("image/png");
        handleInputChange(field.id, photoData);
        cameraRefs.current[field.id] = { photoData };
      }
    }
  };

  const [isRecording, setIsRecording] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null); // Audio URL to play

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]); // Store all chunks of the recording

  const startRecording = async (field: { id: string }) => {
    setIsRecording(true);
    setStatusMessage("Listening");
    audioChunksRef.current = [];

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Your browser does not support audio recording");
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      setStatusMessage("");
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      setAudioUrl(URL.createObjectURL(audioBlob)); // Set the temporary URL for playback
      if (audioBlob) {
        console.log("Audio Blob:", audioBlob);
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result?.toString().split(",")[1];
          if (base64data) {
            console.log("Base64 audio:", base64data);
            handleInputChange(field.id, base64data);

            audioRefs.current[field.id] = { audioData: base64data };
          }
        };
      }
    };

    mediaRecorder.start();
  };

  const resetRecording = () => {
    setAudioUrl(null);
    setIsRecording(false); // Reset recording state
    audioChunksRef.current = []; // Clear all recorded chunks

    // Reset the media recorder references
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current = null;
    }
  };

  const stopRecording = (field: { id: string }) => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Add event listeners to detect drawing on the canvas
  useEffect(() => {
    const canvas = sketchPadRef.current;
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

  const onSubmitSketch = (field: { id: string }) => {
    const originalCanvas = sketchPadRef.current;
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
    handleInputChange(field.id, imageData);
    sketchRefs.current[field.id] = { sketchData: imageData };
    setIsCanvasDirty(false);
  };

  const handleSubmit = () => {
    // Collect data from all fields
    const collectedFields = inputFields.map((field) => {
      if (field.type === "audio") {
        const audioData = audioRefs.current[field.id]?.audioData;
        return { ...field, value: audioData };
      } else if (field.type === "camera") {
        const photoData = cameraRefs.current[field.id]?.photoData;
        return { ...field, value: photoData };
      } else if (field.type === "sketchpad") {
        const sketchData = sketchRefs.current[field.id]?.sketchData;
        return { ...field, value: sketchData };
      } else if (field.type === "file") {
        const fileData = fileRefs.current[field.id]?.fileData;
        return { ...field, value: fileData };
      } else if (field.type === "text") {
        const textValue = textRefs.current[field.id];
        return { ...field, value: textValue };
      } else {
        return field;
      }
    });
    console.log("Collected Inputs", collectedFields);
    onSubmit(collectedFields);

    // Clear the input fields after submission by resetting their values
    setInputFields((prevFields) =>
      prevFields.map((field) => ({ ...field, value: "" }))
    );
  };

  return (
    <div className="bg-white w-96 border p-3 rounded-xl shadow-lg">
      {inputFields.map((field) => (
        <div key={field.id} className="flex flex-col my-2">
          {/* Text Input Field */}
          {field.type === "text" && (
            <>
              {" "}
              <Label>{field.label}</Label>
              <Input
                placeholder={field.label}
                className="mt-1"
                value={field.value || ""}
                onChange={(e) => {
                  handleInputChange(field.id, e.target.value);
                  textRefs.current[field.id] = e.target.value;
                }}
              />
            </>
          )}
          {/* File Upload Field */}
          {field.type === "file" && (
            <div className="flex items-center border p-2 bg-white rounded-xl shadow-lg w-full my-2">
              <input
                type="file"
                name={`file-${field.id}`}
                id={`file-${field.id}`}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                      const base64data = reader.result as string;
                      handleInputChange(field.id, base64data);
                      fileRefs.current[field.id] = {
                        fileData: base64data,
                        fileName: file.name,
                        fileType: file.type,
                      };
                    };
                  }
                }}
              />
              {!field.value && (
                <label htmlFor={`file-${field.id}`} className="w-full m-1">
                  <div className="flex w-full border border-dashed border-gray-500 p-1 rounded-lg">
                    <div className="flex items-center justify-center border border-gray-900 text-gray-900 px-4 py-1.5 rounded-lg">
                      <CloudUploadIcon className="w-5 h-5 mr-1 text-gray-900" />
                      <p className="text-xs">Upload file</p>
                    </div>
                  </div>
                </label>
              )}
              {/* File Preview */}
              {field.value && (
                <div className="flex items-center border border-gray-500 rounded-xl w-full m-1 p-0.5">
                  <div className="h-9 w-9 border border-gray-300 rounded-lg">
                    <FileIcon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-grow flex items-center ml-2">
                    <div className="overflow-hidden w-48">
                      <p className="text-sm text-gray-700 truncate">
                        {fileRefs.current[field.id]?.fileName}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Camera Field */}
          {field.type === "camera" && (
            <div className="flex flex-col items-center w-full h-80 border border-gray-300 shadow-2xl p-2 rounded-xl my-2">
              {isStreaming && !error && (
                <video
                  ref={videoRef}
                  className="w-full h-56 rounded-lg border border-indigo-300 object-cover aspect-[1/1]"
                  autoPlay
                  playsInline
                  muted
                ></video>
              )}
              {/* Placeholder waiting for camera feed */}
              {!isStreaming && !error && (
                <div className="flex flex-col items-center justify-center w-full h-60 bg-gray-100 rounded-lg border border-indigo-300">
                  <CameraIcon className="w-12 h-12 text-gray-400" />
                  <p className="text-sm text-gray-500">Waiting for camera...</p>
                </div>
              )}
              {/* Camera controls */}
              <div className="flex items-center justify-center w-full mt-1">
                <div className="flex-none w-12">
                  {field.value && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="p-0.5 border border-gray-300 w-12 h-12 rounded-md">
                          <Image
                            src={field.value}
                            alt="Captured"
                            width={30}
                            height={30}
                            className="w-full h-full object-cover aspect-[1/1] rounded-sm shadow-md"
                          />
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <div className="flex flex-col items-center">
                          <Image
                            src={field.value}
                            alt={"Captured"}
                            width={512}
                            height={512}
                            className="rounded-lg m-1 border"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                <div className="grow flex justify-center items-center">
                  <button
                    onClick={() => takePhoto(field)}
                    className="p-1 mt-2 border rounded-full shadow-md hover:bg-gray-50"
                  >
                    <div className="p-3 border border-red-200 rounded-full">
                      <CameraIcon className="w-5 h-5 text-red-500" />
                    </div>
                  </button>

                  {!cameraStarted ? (
                    <button
                      onClick={handleStartCamera}
                      className="flex items-center justify-center m-2 mt-4 rounded-lg"
                    >
                      <CirclePowerIcon className="w-5 h-5 text-gray-600" />
                      <div className="h-1 w-1 m-0.5 bg-red-400 rounded-full"></div>
                    </button>
                  ) : (
                    <button
                      onClick={handleStopCamera}
                      className="flex items-center justify-center m-2 mt-4 rounded-lg"
                    >
                      <CirclePowerIcon className="w-5 h-5 text-gray-600" />
                      <div className="h-1 w-1 m-0.5 bg-green-500 rounded-full"></div>
                    </button>
                  )}
                </div>
              </div>
              <canvas ref={canvasRef} className="hidden"></canvas>
            </div>
          )}
          {/* Sketchpad Field */}
          {field.type === "sketchpad" && (
            <div className="w-full my-2">
              <div className="h-80 mb-16">
                <DrawingCanvas
                  ref={sketchPadRef}
                  isCanvasDirty={isCanvasDirty}
                  onSubmit={() => onSubmitSketch(field)}
                />
              </div>
            </div>
          )}
          {/* Audio Recorder Field */}
          {field.type === "audio" && (
            <div className="flex flex-col my-2 ">
              {/* Audio Recorder Controls */}

              <div className="flex items-center justify-center w-full">
                <div className="grow flex justify-center items-center">
                  {/* Start Recording */}
                  <div className="flex items-center mr-1">
                    <div
                      className={`bg-white rounded-full p-1  border ${
                        isRecording ? "" : ""
                      }`}
                    >
                      <button
                        onClick={() =>
                          isRecording
                            ? stopRecording(field)
                            : startRecording(field)
                        }
                        className={`p-3   rounded-full ${
                          isRecording
                            ? "bg-white border animate-pulse text-blue-500"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        <MicIcon className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-center mt-2">
                      {statusMessage !== "" && (
                        <p className="text-gray-500 text-xs mr-1">
                          {statusMessage}
                        </p>
                      )}
                      {isRecording && (
                        <div className="h-2 w-2 rounded-full animate-ping bg-blue-600"></div>
                      )}
                    </div>
                  </div>
                  {!isRecording && audioUrl && (
                    <>
                      <audio
                        ref={audioPlayerRef}
                        controls
                        src={audioUrl}
                        className="w-full"
                      >
                        Your browser does not support the audio element.
                      </audio>
                    </>
                  )}
                  {/* Reset Buttons */}
                  {audioUrl && (
                    <button
                      onClick={resetRecording}
                      className="flex items-center p-2 rounded"
                    >
                      <RefreshCcwIcon className="h-4 w-4 text-gray-800" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      <div className="flex flex-col w-full mt-2">
        {loading ? (
          <Button className="w-full" disabled>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Submit
          </Button>
        ) : (
          <Button className="w-full" onClick={handleSubmit}>
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};

export default MultiInputForm;
