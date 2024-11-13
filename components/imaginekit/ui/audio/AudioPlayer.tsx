"use client";

import React, { useState, useEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { Loader2, Volume2Icon, CircleStopIcon } from "lucide-react";

// Utility function to check if the URL is valid
function isValidUrl(url: string) {
  return (
    url?.startsWith("/") ||
    url?.startsWith("http://") ||
    url?.startsWith("https://") ||
    url?.startsWith("data:audio")
  );
}

// AudioPlayer component
export default function AudioPlayer({
  audio,
  loading,
}: {
  audio: string;
  loading: boolean;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Function to convert base64 audio data to Blob and return a URL
  const base64ToBlobUrl = (base64Data: string) => {
    const byteString = atob(base64Data.split(",")[1]); // Decode Base64 string
    const mimeString = base64Data.split(",")[0].split(":")[1].split(";")[0]; // Get MIME type

    const byteArray = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      byteArray[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([byteArray], { type: mimeString });
    return URL.createObjectURL(blob);
  };

  // Process the audio prop and set the audio URL
  useEffect(() => {
    if (isValidUrl(audio)) {
      if (audio.startsWith("data:audio")) {
        // If it's a base64 data URL, convert it to a blob URL
        const url = base64ToBlobUrl(audio);
        setAudioUrl(url);
      } else {
        // If it's already a valid URL, use it directly
        setAudioUrl(audio);
      }
    } else {
      setAudioUrl(null);
    }

    // Clean up the object URL when the component unmounts or audio changes
    return () => {
      if (audioUrl && audioUrl.startsWith("blob:")) {
        URL.revokeObjectURL(audioUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio]);

  // Handle play and pause
  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Update progress and duration of audio
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Reset play button when the audio ends
  const handleAudioEnd = () => {
    setIsPlaying(false);
    //setCurrentTime(0);
  };

  // Set the duration when metadata is loaded
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Add and remove event listener for "ended" event
  useEffect(() => {
    const audioElement = audioRef.current;

    if (audioElement) {
      audioElement.addEventListener("ended", handleAudioEnd);

      return () => {
        audioElement.removeEventListener("ended", handleAudioEnd);
      };
    }
  }, []);

  return (
    <div className="">
      <div>
        {/* If not loading and the audio URL is valid */}
        {!loading && audioUrl && (
          <div className="flex flex-col items-center justify-center w-96 p-2 pr-8 border rounded-full">
            <div className="flex items-center space-x-2 w-full">
              <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                src={audioUrl}
              />
              <button
                onClick={playAudio}
                className="p-2 border rounded-full focus:outline-none"
              >
                {isPlaying ? (
                  <CircleStopIcon className="w-5 h-5 text-gray-700" />
                ) : (
                  <Volume2Icon className="w-5 h-5 text-gray-700" />
                )}
              </button>
              <div className="w-full mt-4">
                <Slider
                  value={[currentTime]} // Set to current time as a number array
                  max={duration}
                  step={1}
                  className="w-full"
                  onValueChange={(value) => {
                    if (audioRef.current) {
                      const newTime = value[0];
                      audioRef.current.currentTime = newTime;
                      setCurrentTime(newTime); // Update the current time as the slider moves
                    }
                  }}
                />
                <div className="flex justify-between mt-1 text-xs">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* If the audio URL is not valid */}
        {!loading && !audioUrl && (
          <div className="flex items-center justify-center w-96 p-2 pr-8 border rounded-full">
            <div className="p-2 border rounded-full">
              <Volume2Icon className="w-5 h-5 text-gray-700" />
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-lg px-4 m-2 border"></div>
          </div>
        )}

        {/* Show loader when loading */}
        {loading && (
          <div className="flex items-center justify-center w-96 p-2 pr-8 border rounded-full">
            <div className="p-2 border rounded-full">
              <Loader2 className="w-5 h-5 animate-spin text-gray-700" />
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-lg px-4 m-2 border"></div>
          </div>
        )}
      </div>
    </div>
  );
}

// Utility function to format time in mm:ss
const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
};
