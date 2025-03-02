"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RuntimeEngine from "@/components/RuntimeEngine";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Earth, PencilIcon } from "lucide-react";
import WorldScaffolding from "@/components/worlds/WorldScaffolding";
import LoadingWorld from "@/components/worlds/LoadingWorld";
import WorldLogic from "@/components/worlds/WorldLogic";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [appData, setAppData] = useState<{ app: App | null; loading: boolean }>(
    {
      app: null,
      loading: true,
    }
  );
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [uiComponents, setUIComponents] = useState([]);
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
        const [nodesResponse, edgesResponse, uiComponentsResponse] =
          await Promise.all([
            axios.get(`/api/nodes?appId=${appId}`),
            axios.get(`/api/edges?appId=${appId}`),
            axios.get(`/api/uicomponents?appId=${appId}`),
          ]);
        setNodes(nodesResponse.data);
        setEdges(edgesResponse.data);
        setUIComponents(uiComponentsResponse.data);
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

      <div className="flex items-center">
        <p className="text-lg text-blue-900 font-semibold">{app.name}</p>
      </div>
    </>
  );

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="fixed top-0 left-0 m-3 flex items-center">
        <TopButtons />
      </div>

      <div className="fixed top-0 right-0 m-3">
        <div className="flex flex-col items-center">
          {isWorldOwner && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Link href={`/${app.owner.username}/worlds/${app._id}/edit`}>
                    <Button
                      variant="outline"
                      className="items-center rounded-full mb-2"
                    >
                      <PencilIcon className="h-5 w-5 text-indigo-600" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="left" align="center">
                  <p className="text-xs text-gray-700">Edit World</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <WorldLogic data={{ app, nodes, edges }} />
              </TooltipTrigger>
              <TooltipContent side="left" align="center">
                <p className="text-xs text-gray-700">World Logic</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {!isWorldOwner && !app.is_published ? (
        <WorldScaffolding />
      ) : (
        <div className="flex items-center justify-center">
          <div style={{ display: "flex", height: "86vh" }}>
            <RuntimeEngine data={{ nodes, edges, uiComponents }} />
          </div>
        </div>
      )}
      {loadingWorld && <LoadingWorld />}
    </div>
  );
}
