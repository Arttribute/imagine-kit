"use client";

import { useEffect } from "react";
import CreateAppForm from "@/components/forms/CreateAppForm";
import FlickeringGrid from "@/components/magicui/flickering-grid";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";

export default function CreateWorld() {
  const { data: session, status } = useSession();

  useEffect(() => {
    // Only redirect if the session is not loading and there is no session data
    if (status === "loading") return; // Do nothing while loading
    if (!session) {
      redirect("/signin");
    }
  }, [session, status]);

  // While loading, you might want to show a loading spinner or some feedback to the user
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="h-screen flex flex-col items-center justify-center">
        <CreateAppForm />
        <FlickeringGrid
          className="z-0 absolute inset-0 size-full [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
          squareSize={2}
          gridGap={12}
          color="#ec407a"
          maxOpacity={0.5}
          flickerChance={0.1}
        />
      </div>
    </div>
  );
}
