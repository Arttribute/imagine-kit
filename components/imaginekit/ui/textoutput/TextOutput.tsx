"use client";
import React from "react";

function TextOutput({
  text,
  fontSize,
  color,
  backgroundColor,
  borderColor,
  loading,
}: {
  text: string;
  fontSize?: string;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  loading?: boolean;
}) {
  return (
    <div className="w-96 ">
      <div className="text-sm text-center text-white bg-indigo-500 rounded-xl p-4 w-full">
        {!loading && text}
        {loading && (
          <div className="flex justify-center items-center h-full">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-50 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-purple-50 rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TextOutput;
