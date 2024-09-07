"use client";
import CreateAppForm from "@/components/forms/CreateAppForm";
import FlickeringGrid from "@/components/magicui/flickering-grid";

export default function CreateWorld() {
  return (
    <div>
      <div className="h-screen flex flex-col items-center justify-center">
        <CreateAppForm />
        <FlickeringGrid
          className="z-0 absolute inset-0 size-full [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
          squareSize={3}
          gridGap={12}
          color="#3f51b5"
          maxOpacity={0.5}
          flickerChance={0.1}
        />
      </div>
    </div>
  );
}
