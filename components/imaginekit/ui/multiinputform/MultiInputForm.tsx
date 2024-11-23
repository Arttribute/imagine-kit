"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  MicIcon,
  PauseIcon,
  CircleStopIcon,
  RefreshCcwIcon,
  CameraIcon,
  CirclePowerIcon,
  PaperclipIcon,
  CloudUploadIcon,
  FileIcon,
  ArrowUpIcon,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

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
  const [inputFields, setInputFields] = useState(fields);

  // Refs and states for various input types
  const audioRefs = useRef<{ [key: string]: any }>({});
  const cameraRefs = useRef<{ [key: string]: any }>({});
  const sketchRefs = useRef<{ [key: string]: any }>({});
  const fileRefs = useRef<{ [key: string]: any }>({});
  const textRefs = useRef<{ [key: string]: string }>({});

  const handleInputChange = (fieldId: string, value: any) => {
    setInputFields((prevFields) =>
      prevFields.map((field) =>
        field.id === fieldId ? { ...field, value } : field
      )
    );
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
        const sketchData = sketchRefs.current[field.id]?.toDataURL();
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
    // Clear the input fields after submission
    setInputFields(fields.map((field) => ({ ...field, value: "" })));
  };

  return (
    <div className="w-96 border p-2 rounded-xl shadow-lg">
      {inputFields.map((field) => (
        <div key={field.id} className="flex flex-col ">
          <Label>{field.label}</Label>
          {/* Text Input Field */}
          {field.type === "text" && (
            <Input
              placeholder={field.label}
              className="mt-1"
              value={field.value || ""}
              onChange={(e) => {
                handleInputChange(field.id, e.target.value);
                textRefs.current[field.id] = e.target.value;
              }}
            />
          )}
          {/* File Upload Field */}
          {field.type === "file" && (
            <div className="flex items-center border p-2 bg-white rounded-xl shadow-lg w-full">
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
            <div className="flex flex-col items-center w-full h-96 border border-gray-300 shadow-2xl p-2 rounded-xl">
              <video
                ref={(el) => {
                  if (el)
                    cameraRefs.current[field.id] = {
                      ...cameraRefs.current[field.id],
                      videoRef: el,
                    };
                }}
                className="w-full h-auto rounded-lg border border-indigo-300"
                autoPlay
                playsInline
                muted
              ></video>
              {/* Camera controls */}
              <div className="flex items-center justify-center w-full mt-1">
                <div className="flex-none w-16">
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
                    onClick={() => {
                      // Capture Photo
                      const video = cameraRefs.current[field.id]?.videoRef;
                      const canvas = cameraRefs.current[field.id]?.canvasRef;
                      if (video && canvas) {
                        const context = canvas.getContext("2d");
                        if (context) {
                          canvas.width = video.videoWidth;
                          canvas.height = video.videoHeight;
                          context.drawImage(
                            video,
                            0,
                            0,
                            canvas.width,
                            canvas.height
                          );
                          const photoData = canvas.toDataURL("image/png");
                          handleInputChange(field.id, photoData);
                          cameraRefs.current[field.id].photoData = photoData;
                        }
                      }
                    }}
                    className="p-1 mt-2 border rounded-full shadow-md hover:bg-gray-50"
                  >
                    <div className="p-3 border border-red-200 rounded-full">
                      <CameraIcon className="w-5 h-5 text-red-500" />
                    </div>
                  </button>
                </div>
              </div>
              <canvas
                ref={(el) => {
                  if (el)
                    cameraRefs.current[field.id] = {
                      ...cameraRefs.current[field.id],
                      canvasRef: el,
                    };
                }}
                className="hidden"
              ></canvas>
            </div>
          )}
          {/* Sketchpad Field */}
          {field.type === "sketchpad" && (
            <div className="w-full">
              <canvas
                ref={(el) => {
                  if (el) sketchRefs.current[field.id] = el;
                }}
                className="border mt-2"
                style={{ width: "100%", height: "200px" }}
              ></canvas>
            </div>
          )}
          {/* Audio Recorder Field */}
          {field.type === "audio" && (
            <div className="flex flex-col items-center p-2 space-y-3 border rounded-3xl shadow-xl w-full">
              {/* Audio Recorder Controls */}
              {(audioRefs.current[field.id]?.audioUrl ||
                !audioRefs.current[field.id]?.isRecording) && (
                <audio
                  controls
                  src={audioRefs.current[field.id]?.audioUrl}
                  className="w-full"
                >
                  Your browser does not support the audio element.
                </audio>
              )}
              {!audioRefs.current[field.id]?.isRecording &&
                !audioRefs.current[field.id]?.audioUrl && (
                  <div className="w-full">
                    <div className="flex bg-gray-100 rounded-full p-4 w-full">
                      <div className="flex justify-center items-center w-full">
                        <MicIcon className="h-4 w-4 text-gray-300 mr-1" />
                        <p className="text-xs text-gray-400">Start recording</p>
                      </div>
                    </div>
                  </div>
                )}
              {/* Controls */}
              <div className="flex items-center justify-center w-full">
                <div className="flex-none w-20">
                  {/* Reset Button */}
                  {audioRefs.current[field.id]?.audioUrl && (
                    <button
                      onClick={() => {
                        // Reset recording
                        audioRefs.current[field.id] = {};
                        handleInputChange(field.id, null);
                      }}
                      className="flex items-center p-2 rounded"
                    >
                      <RefreshCcwIcon className="h-5 w-5 text-gray-800" />
                      <p className="text-xs text-gray-500 ml-2">Reset</p>
                    </button>
                  )}
                </div>
                <div className="grow flex justify-center items-center">
                  {/* Start Recording */}
                  {!audioRefs.current[field.id]?.isRecording &&
                    !audioRefs.current[field.id]?.audioUrl && (
                      <button
                        onClick={() => {
                          // Start recording
                          navigator.mediaDevices
                            .getUserMedia({ audio: true })
                            .then((stream) => {
                              const mediaRecorder = new MediaRecorder(stream);
                              audioRefs.current[field.id] = {
                                ...audioRefs.current[field.id],
                                mediaRecorder,
                                audioChunks: [],
                                isRecording: true,
                              };
                              mediaRecorder.start();
                              mediaRecorder.ondataavailable = (event) => {
                                audioRefs.current[field.id].audioChunks.push(
                                  event.data
                                );
                              };
                              mediaRecorder.onstop = () => {
                                const audioBlob = new Blob(
                                  audioRefs.current[field.id].audioChunks,
                                  { type: "audio/wav" }
                                );
                                const audioUrl = URL.createObjectURL(audioBlob);
                                audioRefs.current[field.id] = {
                                  ...audioRefs.current[field.id],
                                  audioUrl,
                                  audioData: audioUrl, // For simplicity, you might convert it to base64
                                  isRecording: false,
                                };
                                handleInputChange(field.id, audioUrl);
                              };
                            });
                        }}
                        className="p-4 text-white bg-blue-500 rounded-full hover:bg-blue-700"
                      >
                        <MicIcon className="h-5 w-5" />
                      </button>
                    )}
                  {/* Stop Recording */}
                  {audioRefs.current[field.id]?.isRecording && (
                    <button
                      onClick={() => {
                        // Stop recording
                        audioRefs.current[field.id].mediaRecorder.stop();
                      }}
                      className="p-1 text-white bg-red-500 rounded-full hover:bg-red-600"
                    >
                      <CircleStopIcon className="h-4 w-4" />
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
