"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RuntimeEngine from "@/components/RuntimeEngine";
import EnterWorld from "@/components/worlds/EnterWorld";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Earth, PencilIcon } from "lucide-react";
import WorldScaffolding from "@/components/worlds/WorldScaffolding";
import LoadingWorld from "@/components/worlds/LoadingWorld";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { set } from "lodash";

interface CustomUser {
  username?: string | null;
}

interface CustomSession {
  user?: CustomUser;
}

interface App {
  name: string;
  owner: {
    username: string;
  };
  _id: string;
  is_published: boolean;
  is_private: boolean;
}

export default function World({ params }: { params: { id: string } }) {
  const [startInteraction, setStartInteraction] = useState(false);
  const [appData, setAppData] = useState<{ app: App | null; loading: boolean }>(
    {
      app: null,
      loading: true,
    }
  );
  const [loadingWorld, setLoadingWorld] = useState(false);

  const { data: session, status } = useSession() as {
    data: CustomSession;
    status: string;
  };
  const { id: appId } = params;
  const { app } = appData;

  useEffect(() => {
    const fetchApp = async () => {
      setLoadingWorld(true);
      try {
        const { data } = await axios.get(`/api/apps/app?appId=${appId}`);
        setAppData({ app: data, loading: false });
      } catch (error) {
        console.error("Failed to load app data", error);
        setAppData({ app: null, loading: false });
      }
      setLoadingWorld(false);
    };
    fetchApp();
  }, [appId]);

  if (appData.loading) return <LoadingWorld />;
  if (!app) return <div>App not found</div>;

  const isWorldOwner = session?.user?.username === app?.owner.username;

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

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="fixed top-0 left-0 m-3 flex items-center">
        <TopButtons />
      </div>

      <div className="fixed top-0 right-0 m-3">
        {isWorldOwner && (
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
        )}
      </div>

      {!startInteraction ? (
        app.is_published || isWorldOwner ? (
          <EnterWorld app={app} setStartInteraction={setStartInteraction} />
        ) : null
      ) : (
        <div className="flex items-center justify-center">
          <div style={{ display: "flex", height: "86vh", width: "80vw" }}>
            <RuntimeEngine appId={appId} />
          </div>
        </div>
      )}
      {!isWorldOwner && !app.is_published && <WorldScaffolding />}
      {loadingWorld && <LoadingWorld />}
    </div>
  );
}
