"use client";

import { useState, useRef } from "react";
import {
  MicIcon,
  RefreshCcwIcon,
  CircleStopIcon,
  PauseIcon,
  ArrowUpIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AudioRecorder({
  onSubmitAudio,
  loading,
}: {
  onSubmitAudio: (audio: string) => void;
  loading: boolean;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false); // Track whether the recording is paused
  const [audioUrl, setAudioUrl] = useState<string | null>(null); // Audio URL to play
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null); // Final Blob
  const [recordingTime, setRecordingTime] = useState(0); // Track time in seconds
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]); // Store all chunks of the recording
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null); // Ref to store the audio stream

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream; // Save the stream for reuse after pausing
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
    setIsPaused(false);
    setRecordingTime(0);

    timerRef.current = setInterval(() => {
      setRecordingTime((prevTime) => prevTime + 1);
    }, 1000); // Update time every second

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data); // Collect the recorded audio data chunks
    };

    mediaRecorder.onstop = () => {
      // Create the audio blob and URL when the recording is paused or stopped
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      setAudioBlob(audioBlob);
      setAudioUrl(URL.createObjectURL(audioBlob)); // Set the temporary URL for playback
    };
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current); // Stop the timer
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && !isPaused) {
      mediaRecorderRef.current.stop(); // Stop recording to finalize the chunks
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current); // Pause the timer
    }
  };

  const resumeRecording = async () => {
    if (streamRef.current && isPaused) {
      const mediaRecorder = new MediaRecorder(streamRef.current); // Reuse the same stream
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsPaused(false);
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000); // Resume the timer

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data); // Append new chunks to the existing ones
      };

      mediaRecorder.onstop = () => {
        // Create the audio blob and URL after resuming and stopping
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        setAudioBlob(audioBlob);
        setAudioUrl(URL.createObjectURL(audioBlob));
      };
    }
  };

  const resetRecording = () => {
    setAudioUrl(null);
    setAudioBlob(null);
    setRecordingTime(0);
    setIsPaused(false);
    setIsRecording(false); // Reset recording state
    audioChunksRef.current = []; // Clear all recorded chunks

    // Reset the media recorder references
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current = null;
    }
  };

  //submit recording as base64
  const submitRecording = () => {
    if (audioBlob) {
      //change blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = () => {
        const base64data = reader.result?.toString().split(",")[1];
        if (base64data) {
          console.log("Base64 audio:", base64data);
          onSubmitAudio(base64data);
          resetRecording();
        }
      };
    }
  };

  // Format the time as minutes:seconds (e.g., 02:34)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  // Recording animation colors
  const colors = ["bg-black", "bg-gray-500", "bg-gray-700", "bg-gray-300"];
  const delays = ["", "delay-100", "delay-200", "delay-300"];

  return (
    <div className="flex flex-col items-center p-2 space-y-3 border rounded-3xl shadow-xl w-96">
      {/* Display audio player only when recording is paused or stopped */}
      {(isPaused || !isRecording) && audioUrl && (
        <audio ref={audioPlayerRef} controls src={audioUrl} className="w-full">
          Your browser does not support the audio element.
        </audio>
      )}

      {/* audio placeholder when there is no audio and nothing is being recored*/}

      {!isRecording && !audioUrl && (
        <div className="w-full">
          <div className="flex bg-gray-100 rounded-full p-4 w-full">
            <div className="flex justify-center items-center w-full">
              <MicIcon className="h-4 w-4 text-gray-300 mr-1" />
              <p className="text-xs text-gray-400">Start recording</p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar and Timer when recording */}
      {isRecording && !isPaused && (
        <div className="w-full">
          <div className="flex bg-gray-100 rounded-full p-4 w-full">
            <div className="flex-none text-center text-sm mr-2 w-12 mb-0.5">
              {formatTime(recordingTime)}
            </div>

            <div className="grow flex justify-center items-center">
              <div className="flex items-center justify-center space-x-2">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 ${
                      colors[idx % colors.length]
                    } rounded-full animate-bounce ${
                      delays[idx % delays.length]
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex-none w-12"></div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center w-full">
        <div className="flex-none w-20">
          {/* Reset Buttons */}
          {audioUrl && (
            <button
              onClick={resetRecording}
              className="flex items-center p-2 rounded"
            >
              <RefreshCcwIcon className="h-5 w-5 text-gray-800" />
              <p className="text-xs text-gray-500 ml-2">Reset</p>
            </button>
          )}
        </div>

        <div className="grow flex justify-center items-center">
          {/* Start Recording */}
          {!isRecording && !audioUrl && (
            <button
              onClick={startRecording}
              className="p-4 text-white bg-blue-500 rounded-full hover:bg-blue-700"
            >
              <MicIcon className="h-5 w-5" />
            </button>
          )}

          {/* Pause/Resume Recording */}
          {isRecording && !isPaused && (
            <button
              onClick={pauseRecording}
              className="p-4 rounded-full border shadow-sm"
            >
              <PauseIcon className="h-5 w-5 text-gray-600" />
            </button>
          )}

          {isPaused && (
            <button
              onClick={resumeRecording}
              className="p-4 rounded-full border shadow-sm"
            >
              <MicIcon className="h-5 w-5 text-red-500" />
            </button>
          )}
        </div>

        <div className="flex-none w-20">
          {/* Stop Recording */}
          {isRecording && (
            <button
              onClick={stopRecording}
              className="p-1 text-white bg-red-500 rounded-full hover:bg-red-600"
            >
              <CircleStopIcon className="h-4 w-4" />
            </button>
          )}
          {audioUrl ? (
            <Button
              onClick={submitRecording}
              className={`ml-1 p-3 rounded-xl ${!isRecording && "ml-6"}`}
            >
              <ArrowUpIcon className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              disabled
              className={`ml-1 p-3 rounded-xl ${!isRecording && "ml-7"}`}
            >
              <ArrowUpIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
