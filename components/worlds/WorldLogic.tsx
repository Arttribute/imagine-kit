"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // For client-side navigation
import axios from "axios"; // Import axios
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NodeDiagram from "@/components/worlds/NodeDiagram";
import { Shuffle, Binary, Loader2 } from "lucide-react";

interface WorldLogicProps {
  data: {
    app: any;
    nodes: any[];
    edges: any[];
  };
}

interface CustomUser {
  username?: string | null;
  id?: string | null;
}

interface CustomSession {
  user?: CustomUser;
}

export default function WorldLogic({ data }: WorldLogicProps) {
  const router = useRouter();
  const [nodes, setNodes] = useState(data.nodes);
  const [edges, setEdges] = useState(data.edges);
  const [loadingRemix, setLoadingRemix] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { data: session, status } = useSession() as {
    data: CustomSession;
    status: string;
  };

  useEffect(() => {
    const logicnodes = data.nodes.map((node) => ({
      ...node,
      id: node.node_id,
    }));
    setNodes(logicnodes);
    setEdges(data.edges);
  }, [data.nodes, data.edges]);

  useEffect(() => {
    if (status === "loading") return;
    setIsAuthenticated(!!session?.user?.username);
  }, [session, status]);

  const handleRemix = async () => {
    setLoadingRemix(true);
    try {
      const appData = {
        owner: session?.user?.id,
        appId: data.app._id,
      };
      const response = await axios.post("/api/apps/remix", appData);
      const newApp = response.data;
      // Redirect to the edit page of the newly created app
      router.push(`/${session?.user?.username}/worlds/${newApp._id}/edit`);
      setLoadingRemix(false);
    } catch (error) {
      console.error("Error remixing:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full">
          <Binary className="w-6 h-6 text-indigo-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>World Logic</DialogTitle>
          <DialogDescription>
            {"Peek under the hood and see how it works."}
          </DialogDescription>
        </DialogHeader>

        <NodeDiagram data={{ nodes, edges }} />

        <DialogFooter>
          {isAuthenticated && (
            <div>
              {loadingRemix ? (
                <Button
                  disabled
                  type="button"
                  className="bg-indigo-600 hover:bg-indigo-500"
                >
                  Remixing..
                  <Loader2 className="w-4 h-4 ml-1 animate-spin" />
                </Button>
              ) : (
                <Button
                  onClick={handleRemix}
                  type="button"
                  className="bg-indigo-600 hover:bg-indigo-500"
                >
                  <Shuffle className="w-4 h-4 mr-1" />
                  Remix
                </Button>
              )}
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
