import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Bot, Sparkles } from "lucide-react";

export default function IMageGenerator() {
  return (
    <>
      <div className="rounded-xl border p-4 m-1 w-64 shadow-sm">
        <div className="flex justify-between mb-3">
          <p className="text-sm font-semibold">Image gen name </p>
          <div className="flex items-center">
            <Sparkles className="h-4 w-4 text-gray-500 mb-1 mr-0.5" />
            <p className="text-xs text-gray-500">Image Gen</p>
          </div>
        </div>

        <div className="flex flex-col mb-3">
          <p className="mb-1 text-sm font-semibold">Inputs</p>
          <Input placeholder="Type your instructions here" />
        </div>
      </div>
    </>
  );
}
