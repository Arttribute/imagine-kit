"use client";
import { useState, useEffect } from "react";
import RuntimeEngine from "@/components/RuntimeEngine";

import EnterWorld from "@/components/worlds/EnterWorld";
import axios from "axios";

export default function World({ params }: { params: { id: string } }) {
  const [startInteraction, setStartInteraction] = useState(false);
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const appId = params.id;

  useEffect(() => {
    getApp();
  }, []);

  const getApp = async () => {
    const response = await axios.get(`/api/apps/app?appId=${appId}`);
    setApp(response.data);
    setLoading(false);
  };

  return (
    <div>
      {!loading && app && !startInteraction && (
        <EnterWorld app={app} setStartInteraction={setStartInteraction} />
      )}
      {startInteraction && <RuntimeEngine appId={appId} />}
    </div>
  );
}
