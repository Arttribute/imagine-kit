import * as React from "react";
import { Button } from "@/components/ui/button";
import FlickeringGrid from "@/components/magicui/flickering-grid";

export default function EnterWorld({
  app,
  setStartInteraction,
}: {
  app: any;
  setStartInteraction: any;
}) {
  const onStartInteraction = () => {
    setStartInteraction(true);
  };
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="border border-gray-500 shadow-xl rounded-2xl bg-white z-10 p-2 w-96 lg:w-[460px]">
        <div className="p-6 border  border-gray-300 rounded-xl">
          <div className="p-6 mb-4 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-semibold">{app.name}</h1>
            <p className="text-gray-500">
              {app.intro || `Welcome to the ${app.name} world`}
            </p>
          </div>
          <div className="flex justify-center p-4 w-full">
            <Button
              onClick={onStartInteraction}
              className="w-full bg-indigo-500 hover:bg-indigo-600"
            >
              Enter World
            </Button>
          </div>
        </div>
      </div>

      <FlickeringGrid
        className="z-0 absolute inset-0 size-full [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
        squareSize={3}
        gridGap={12}
        color="#3f51b5"
        maxOpacity={0.5}
        flickerChance={0.1}
      />
    </div>
  );
}
