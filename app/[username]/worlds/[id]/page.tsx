"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RuntimeEngine from "@/components/RuntimeEngine";
import EnterWorld from "@/components/worlds/EnterWorld";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Earth, PencilIcon } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function World({ params }: { params: { id: string } }) {
  const [startInteraction, setStartInteraction] = useState(false);
  interface App {
    name: string;
    owner: {
      username: string;
    };
    _id: string;
  }

  const [appData, setAppData] = useState<{ app: App | null; loading: boolean }>(
    { app: null, loading: true }
  );
  const { id: appId } = params;

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const { data } = await axios.get(`/api/apps/app?appId=${appId}`);
        setAppData({ app: data, loading: false });
      } catch (error) {
        console.error("Failed to load app data", error);
        setAppData({ app: null, loading: false });
      }
    };
    fetchApp();
  }, [appId]);

  if (appData.loading) return <div>Loading...</div>;

  const { app } = appData;

  if (!app) return <div>App not found</div>;

  const TopButtons = () => (
    <>
      <Link href="/worlds">
        <Button variant="outline" className="items-center mr-2">
          <Earth className="h-5 w-5 text-indigo-500" />
        </Button>
      </Link>
      {startInteraction && (
        <div className="flex items-center">
          <p className="text-lg text-blue-900 font-semibold">{app.name}</p>
        </div>
      )}
    </>
  );

  const EditButton = () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link href={`/${app.owner.username}/worlds/${app._id}/edit`}>
          <Button variant="outline" className="items-center rounded-full">
            <PencilIcon className="h-5 w-5 text-indigo-500" />
          </Button>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="flex w-28 items-center justify-center p-3 rounded-xl">
        <p className="text-xs text-gray-700">Edit World</p>
      </HoverCardContent>
    </HoverCard>
  );

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="fixed top-0 left-0 m-3 flex items-center">
        <TopButtons />
      </div>

      <div className="fixed top-0 right-0 m-3">
        <EditButton />
      </div>

      {!startInteraction ? (
        <EnterWorld app={app} setStartInteraction={setStartInteraction} />
      ) : (
        <div style={{ display: "flex", height: "86vh", width: "80vw" }}>
          <RuntimeEngine appId={appId} />
        </div>
      )}
    </div>
  );
}
