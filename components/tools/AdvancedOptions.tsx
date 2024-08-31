"use client";
import { useState, useEffect } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { Sliders } from "lucide-react";

import { Button } from "@/components/ui/button";
//import { ScrollArea } from "@radix-ui/react-scroll-area";

export default function AdvancedOptions({
  openControlnetOptions,
  numberOfImages,
  numSteps,
  cfgScale,
  width,
  height,
  superResolution,
  privateCreation,
  aspectRatio,
  scheduler,
  colorGrading,
  negativePrompt,
  setNumSteps,
  setNumberOfImages,
  setCfgScale,
  setWidth,
  setHeight,
  setSuperResolution,
  setPrivateCreation,
  setAspectRatio,
  setScheduler,
  setColorGrading,
  setNegativePrompt,
}: {
  openControlnetOptions: boolean;
  numberOfImages: number;
  numSteps: number;
  cfgScale: number;
  width: number;
  height: number;
  superResolution: boolean;
  privateCreation: boolean;
  aspectRatio: string;
  scheduler: string;
  colorGrading: string;
  negativePrompt: string;
  setNumberOfImages: (value: number) => void;
  setNumSteps: (value: number) => void;
  setCfgScale: (value: number) => void;
  setWidth: (value: number) => void;
  setHeight: (value: number) => void;
  setSuperResolution: (value: boolean) => void;
  setPrivateCreation: (value: boolean) => void;
  setAspectRatio: (value: string) => void;
  setScheduler: (value: string) => void;
  setColorGrading: (value: string) => void;
  setNegativePrompt: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="m-1 p-1 rounded-lg border border-neutral-300">
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="rounded-md   "
        >
          <CollapsibleTrigger asChild className="w-full ">
            <Button variant="ghost" className="px-7 w-full border-purple-500">
              <div className="mr-2">Advanced Options </div>
              <Sliders className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="">
            <ScrollArea
              className="rounded-md p-2"
              style={
                openControlnetOptions ? { height: "25vh" } : { height: "100%" }
              }
            >
              <div className="mr-3">
                <Select
                  onValueChange={(value) => setNumberOfImages(Number(value))}
                >
                  <div className="flex ml-3 mt-2 mb-1 text-sm font-medium">
                    Number of images
                  </div>
                  <SelectTrigger className="m-2">
                    <SelectValue placeholder="1" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Number of images</SelectLabel>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select onValueChange={(value) => setAspectRatio(value)}>
                  <div className="flex ml-3 mt-2 mb-1 text-sm font-medium">
                    Aspect Ratio
                  </div>
                  <SelectTrigger className="m-2">
                    <SelectValue placeholder="1:1" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Number of images</SelectLabel>
                      <SelectItem value="1:1">1:1</SelectItem>
                      <SelectItem value="portrait">portrait</SelectItem>
                      <SelectItem value="16:9">16:9</SelectItem>
                      <SelectItem value="landscape">landscape</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <div className="m-2">
                  <div className="flex items-center justify-between">
                    <Slider
                      defaultValue={[width]}
                      max={1536}
                      step={8}
                      onValueChange={(value) => setWidth(Number(value))}
                    />
                    <span className="text-xs m-0.5">W</span>
                    <div className="border rounded p-0.5 m-1 text-xs w-8 h-5.5 tems-center  ">
                      {width}
                    </div>
                    <span className="text-xs">px</span>
                  </div>
                </div>
                <div className="m-2">
                  <div className="flex items-center justify-between">
                    <Slider
                      defaultValue={[height]}
                      max={1536}
                      step={8}
                      onValueChange={(value) => setHeight(Number(value))}
                    />
                    <span className="text-xs m-0.5">H</span>
                    <div className="border rounded p-0.5 m-1 text-xs w-8 h-5.5 tems-center  ">
                      {height}
                    </div>
                    <span className="text-xs">px</span>
                  </div>
                </div>
                <Select>
                  <div className="flex ml-3 mt-2  text-sm font-medium">
                    Scheduler
                  </div>
                  <SelectTrigger className="m-2">
                    <SelectValue placeholder="Scheduler" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Schedulers</SelectLabel>
                      <SelectItem value="euler">Euler</SelectItem>
                      <SelectItem value="euler_a">Euler_a</SelectItem>
                      <SelectItem value="dpm++2m_karras">
                        dpm++2m_karras
                      </SelectItem>
                      <SelectItem value="dpm++sde_karras">
                        dpm++sde_karras
                      </SelectItem>
                      <SelectItem value="lcm">lcm</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select onValueChange={(value) => setColorGrading(value)}>
                  <div className="flex ml-3 mt-2  text-sm font-medium">
                    Color grading
                  </div>
                  <SelectTrigger className="m-2">
                    <SelectValue placeholder="Color grading" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Color grading</SelectLabel>
                      <SelectItem value="Film Velvia">Film Velvia</SelectItem>
                      <SelectItem value="Film Portra">Film Portra</SelectItem>
                      <SelectItem value="Ektar">Ektar</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <div className="m-2">
                  <div className="flex ml-0 mt-3  text-sm font-medium">
                    Steps
                  </div>
                  <div className="flex items-center justify-between">
                    <Slider
                      defaultValue={[numSteps]}
                      max={50}
                      step={1}
                      onValueChange={(value) => setNumSteps(Number(value))}
                    />
                    <div className="border rounded p-0.5 m-1 text-xs w-6 h-5.5 tems-center  ">
                      {numSteps}
                    </div>
                  </div>
                </div>
                <div className="m-2">
                  <div className="flex ml-0 mt-3  text-sm font-medium">
                    CFG scale
                  </div>
                  <div className="flex items-center justify-between">
                    <Slider
                      defaultValue={[cfgScale]}
                      max={15}
                      step={1}
                      onValueChange={(value) => setCfgScale(Number(value))}
                    />
                    <div className="border rounded p-0.5 m-1 text-xs w-6 h-5.5 tems-center  ">
                      {cfgScale}
                    </div>
                  </div>
                </div>
                <div className="m-2">
                  <div className="flex ml-0 mt-3 mb-2 text-sm font-medium">
                    Negative Prompt
                  </div>
                  <Textarea
                    placeholder="Negative Prompt"
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                  />
                </div>
              </div>
            </ScrollArea>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </>
  );
}
