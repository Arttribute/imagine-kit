"use client";

import store from "@/store/store";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Provider } from "react-redux";
import Editor from "@/components/Editor";
import { useSession } from "next-auth/react"; // Assuming next-auth is used for session
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface CustomUser {
  username?: string | null;
}

interface CustomSession {
  user?: CustomUser;
}

export default function EditWorld({
  params,
}: {
  params: { username: string; id: string };
}) {
  const { data: session, status } = useSession() as {
    data: CustomSession;
    status: string;
  };
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const router = useRouter();

  const appId = params.id;
  const username = params.username;

  useEffect(() => {
    // Only proceed if the session is loaded
    if (status === "loading") return;

    if (!session?.user?.username) {
      // Redirect to homepage if no logged-in user is found
      router.push("/");
    } else {
      // Check if the logged-in user is the owner of the world
      const isWorldOwner = session.user.username === username;
      setIsOwner(isWorldOwner);
      setLoading(false);

      if (!isWorldOwner) {
        // Redirect or show an access denied page if the user is not the owner
        router.push("/"); // You can replace this with an access denied page
      }
    }
  }, [session, status, username, router]);

  if (loading) return <div>Loading...</div>;

  return (
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        {isOwner && appId && <Editor appId={appId} owner={username} />}
      </DndProvider>
    </Provider>
  );
}
