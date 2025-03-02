"use client";
import { useState, useEffect } from "react";
import RuntimeEngine from "@/components/RuntimeEngine";
import { useSession } from "next-auth/react";
import axios from "axios";
import LoadingWorld from "@/components/worlds/LoadingWorld";
import WorldScaffolding from "@/components/worlds/WorldScaffolding";

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

export default function EmbedPage({ params }: { params: { id: string } }) {
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

  const [loadingComponents, setLoadingComponents] = useState(true);
  useEffect(() => {
    setLoadingComponents(true);
    if (nodes.length > 0 && edges.length > 0 && uiComponents.length > 0) {
      setLoadingComponents(false);
    }
  }, [nodes, edges, uiComponents, uiComponents]);

  if (appData.loading) return <LoadingWorld />;
  if (!app) return <div>App not found</div>;

  const isWorldOwner = session?.user?.username === app?.owner.username;
  return (
    <div style={{ margin: 0, padding: 0 }}>
      {!isWorldOwner && !app.is_published ? (
        <WorldScaffolding />
      ) : !loadingComponents ? (
        <div className="flex items-center justify-center">
          <div className="rounded-xl  mr-2 mt-16 w-[70vw]">
            <div style={{ display: "flex", height: "88vh" }}>
              <div className="w-full h-full">
                <RuntimeEngine data={{ nodes, edges, uiComponents }} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <LoadingWorld />
      )}
    </div>
  );
}
