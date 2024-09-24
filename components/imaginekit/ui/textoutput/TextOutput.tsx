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
        {text}
        {loading && <p>Loading...</p>}
      </div>
    </div>
  );
}

export default TextOutput;
