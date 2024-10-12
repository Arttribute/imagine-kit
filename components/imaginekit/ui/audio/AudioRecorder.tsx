"use client";

import { useState, useRef } from "react";
import {
  MicIcon,
  TrashIcon,
  CircleStopIcon,
  DownloadIcon,
  PauseIcon,
  PlayIcon,
} from "lucide-react";

const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false); // Track whether the recording is paused
  const [audioUrl, setAudioUrl] = useState<string | null>(null); // Audio URL to play
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null); // Final Blob
  const [recordingTime, setRecordingTime] = useState(0); // Track time in seconds
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]); // Store all chunks of the recording
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null); // Reference for audio playback
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
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current); // Stop the timer

      // Create the final audio Blob and URL
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      setAudioBlob(audioBlob);
      setAudioUrl(URL.createObjectURL(audioBlob));
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && !isPaused) {
      mediaRecorderRef.current.stop(); // Stop recording to finalize the chunks
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current); // Pause the timer

      // Create a temporary audio Blob to allow playback of what has been recorded so far
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      setAudioUrl(URL.createObjectURL(audioBlob)); // Set the temporary URL for playback
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
    }
  };

  const resetRecording = () => {
    setAudioUrl(null);
    setAudioBlob(null);
    setRecordingTime(0);
    setIsPaused(false);
    audioChunksRef.current = []; // Clear all recorded chunks
  };

  const saveRecording = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "recording.wav";
      a.click();
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

  return (
    <div className="flex flex-col items-center p-4 space-y-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold">Audio Recorder</h2>

      {/* Start Recording */}
      {!isRecording && !audioUrl && (
        <button
          onClick={startRecording}
          className="p-4 text-white bg-blue-500 rounded-full hover:bg-blue-700"
        >
          <MicIcon className="h-5 w-5" />
        </button>
      )}

      {/* Stop Recording */}
      {isRecording && (
        <button
          onClick={stopRecording}
          className="p-4 text-white bg-red-500 rounded-full hover:bg-red-700"
        >
          <CircleStopIcon className="h-5 w-5" />
        </button>
      )}

      {/* Pause/Resume Recording */}
      {isRecording && !isPaused && (
        <button
          onClick={pauseRecording}
          className="p-4 text-white bg-yellow-500 rounded-full hover:bg-yellow-700"
        >
          <PauseIcon className="h-5 w-5" />
        </button>
      )}

      {isPaused && (
        <button
          onClick={resumeRecording}
          className="p-4 text-white bg-green-500 rounded-full hover:bg-green-700"
        >
          <PlayIcon className="h-5 w-5" />
        </button>
      )}

      {/* Progress Bar and Timer */}
      {isRecording && (
        <div className="w-full mt-4">
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
              <div
                style={{ width: `${(recordingTime % 60) * (100 / 60)}%` }} // Simple progress bar logic
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
              />
            </div>
            <div className="text-center font-medium">
              <span>Recording: {formatTime(recordingTime)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Audio Preview */}
      {audioUrl && (
        <audio ref={audioPlayerRef} controls src={audioUrl} className="w-full">
          Your browser does not support the audio element.
        </audio>
      )}

      {/* Save/Reset Buttons */}
      {audioUrl && (
        <div className="flex space-x-4">
          <button
            onClick={saveRecording}
            className="p-2 text-white bg-green-500 rounded hover:bg-green-700"
          >
            <DownloadIcon className="h-5 w-5" />
          </button>
          <button
            onClick={resetRecording}
            className="p-2 text-white bg-gray-500 rounded hover:bg-gray-700"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
