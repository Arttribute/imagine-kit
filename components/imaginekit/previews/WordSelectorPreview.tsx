"use client";
import React from "react";
import { TypeOutlineIcon } from "lucide-react";

interface WordSelectorPreviewProps {}

const WordSelectorPreview: React.FC<WordSelectorPreviewProps> = ({}) => {
  return (
    <div className="w-96">
      <div className="grid grid-cols-2">
        <div className="col-span-1 bg-amber-50 flex rounded-lg border-2 m-1 p-2">
          <p className="text-gray-400 text-sm">selection </p>
        </div>
        <div className="col-span-1 bg-amber-50 flex rounded-lg border-2 m-1 p-2">
          <p className="text-gray-400 text-sm">selection</p>
        </div>
      </div>
      <div className="grid grid-cols-4">
        <div className="col-span-1 bg-gray-50 flex rounded-lg border-2 m-1 p-2">
          <TypeOutlineIcon className="w-5 h-5 text-gray-400 mr-2" />
          <p className="text-gray-400 text-sm">word</p>
        </div>
        <div className="col-span-1 bg-gray-50 flex rounded-lg border-2 m-1 p-2">
          <TypeOutlineIcon className="w-5 h-5 text-gray-400 mr-2" />
          <p className="text-gray-400 text-sm">word</p>
        </div>
        <div className="col-span-1 bg-gray-50 flex rounded-lg border-2 m-1 p-2">
          <TypeOutlineIcon className="w-5 h-5 text-gray-400 mr-2" />
          <p className="text-gray-400 text-sm">word</p>
        </div>
        <div className="col-span-1 bg-gray-50 flex rounded-lg border-2 m-1 p-2">
          <TypeOutlineIcon className="w-5 h-5 text-gray-400 mr-2" />
          <p className="text-gray-400 text-sm">word</p>
        </div>
      </div>
    </div>
  );
};

export default WordSelectorPreview;
