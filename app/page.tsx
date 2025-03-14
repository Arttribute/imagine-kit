"use client";
import React from "react";
import RetroGrid from "@/components/magicui/retro-grid";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import AppBar from "@/components/layout/AppBar";
import Link from "next/link";
import CreateWorld from "@/components/worlds/CreateWorld";

export default function Home() {
  return (
    <div>
      <AppBar />
      <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background md:shadow-xl">
        <div className="flex z-10 mb-2">
          <p className=" h-20 pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-r from-orange-500 via-pink-500 to-indigo-500 bg-clip-text text-center text-7xl font-bold leading-none tracking-tighter text-transparent">
            Imagine kit
          </p>
          <Sparkles className="h-6 w-6 text-indigo-500" />
        </div>
        <p className="text-xl text-center mb-6 text-indigo-950">
          Create fun AI apps and use them anywhere on the web
        </p>
        <div className="lg:w-[42vw] z-10">
          <CreateWorld />
        </div>

        <RetroGrid />
      </div>
    </div>
  );
}
