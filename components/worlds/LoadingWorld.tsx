"use client";
import Particles from "@/components/magicui/particles";
import { Loader2Icon } from "lucide-react";

export default function LoadingWorld() {
  return (
    <div className="relative flex h-[90vh] w-full flex-col items-center justify-center overflow-hidden rounded-lg">
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
        <Loader2Icon className="w-4 h-4 inline-block animate-spin text-gray-600" />
      </span>

      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        color="text-gray-600"
        refresh
      />
    </div>
  );
}
