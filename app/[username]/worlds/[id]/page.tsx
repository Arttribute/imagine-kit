"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import RuntimeEngine from "@/components/RuntimeEngine";
import EnterWorld from "@/components/worlds/EnterWorld";
import { Button } from "@/components/ui/button";
import axios from "axios";

import { Earth } from "lucide-react";

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
        <div className="flex justify-center items-center h-screen">
          <div className="absolute top-0 left-0 ">
            <div className="flex items-center m-2">
              <Link href="/worlds">
                <Button variant="outline" className="items-center mr-2">
                  <div className="flex ">
                    <Earth className="h-5 w-5 text-indigo-500 " />
                  </div>
                </Button>
              </Link>
            </div>
          </div>
          <EnterWorld app={app} setStartInteraction={setStartInteraction} />
        </div>
      )}
      {startInteraction && (
        <div className="flex justify-center items-center h-screen">
          <div className="absolute top-0 left-0 ">
            <div className="flex items-center m-2">
              <Link href="/worlds">
                <Button variant="outline" className="items-center mr-2">
                  <div className="flex ">
                    <Earth className="h-5 w-5 text-indigo-500 " />
                  </div>
                </Button>
              </Link>
              <div className="flex items-center">
                <p className="text-lg text-blue-900 font-semibold">
                  {app.name}
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", height: "86vh", width: "80vw" }}>
            <div className="">
              <RuntimeEngine appId={appId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
