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
    <div className=" col-span-12 lg:col-span-10  w-full ">
      <div className="text-sm text-center text-white bg-indigo-500 rounded-xl p-4">
        {text}
        {loading && <p>Loading...</p>}
      </div>
    </div>
  );
}

export default TextOutput;
