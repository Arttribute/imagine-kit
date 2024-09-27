"use client";
import { useEffect } from "react";
import CreateAppForm from "@/components/forms/CreateAppForm";
import FlickeringGrid from "@/components/magicui/flickering-grid";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import AccountMenu from "@/components/account/AccountMenu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Earth } from "lucide-react";

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
      <div className="fixed top-0 left-0 z-10">
        <div className="flex items-center m-3">
          <Link href="/worlds">
            <Button variant="outline" className="items-center mr-2">
              <div className="flex ">
                <Earth className="h-5 w-5 text-indigo-500 " />
              </div>
            </Button>
          </Link>
        </div>
      </div>
      <div className="fixed top-0 left-0 right-0 ">
        <div className="flex">
          <div className="ml-auto ">
            <div className="m-3">
              <AccountMenu />
            </div>
          </div>
        </div>
      </div>
      <div className="h-screen flex flex-col items-center justify-center ">
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
