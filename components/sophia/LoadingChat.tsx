import React from "react";
import { LoaderPinwheel } from "lucide-react";

export default function LoadingChat() {
  return (
    <div className="flex items-center h-full">
      <LoaderPinwheel className="w-4 h-4 animate-spin text-indigo-500 mr-2" />
      <div className="flex space-x-2">
        <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce"></div>
        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-300"></div>
      </div>
    </div>
  );
}
