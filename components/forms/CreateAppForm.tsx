"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { Sparkles } from "lucide-react";
import GodPromptDialog from "./GodPromptDialog";
import axios from "axios";
import { set } from "mongoose";

const CreateAppForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [createPrompt, setCreatePrompt] = useState("");
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [uiComponents, setUiComponents] = useState([]);
  const [error, setError] = useState("");
  const { data: session }: any = useSession();

  const router = useRouter();

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const appData = {
        owner: session?.user?.id || "66dd548dfa3ec069d5f49fd6",
        name,
        description,
      };

      if (createPrompt !== "") {
        const genData = await handleGodPrompt();
        const generatedappData = {
          owner: session?.user?.id || "66dd548dfa3ec069d5f49fd6",
          name: genData.name,
          description: genData.description,
        };
        const response = await axios.post("/api/apps", generatedappData);
        console.log("Response", response.data);
        const appId = response.data._id;

        const nodeData = genData.nodes.map((node: any) => ({
          ...node,
          app_id: appId,
        }));
        const edgeData = genData.edges.map((edge: any) => ({
          ...edge,
          app_id: appId,
        }));
        const uiComponentsToSave = genData.uiComponents.map(
          (uiComponent: any) => ({
            ...uiComponent,
            app_id: appId,
          })
        );

        await axios.post("/api/nodes", { nodes: nodeData });
        await axios.post("/api/edges", { edges: edgeData });
        await axios.post("/api/uicomponents", {
          uiComponents: uiComponentsToSave,
        });
        router.push(`/${session?.user?.name || "bashy"}/worlds/${appId}/edit`);
        setLoading(false);
      } else {
        console.log("App data", appData);
        const response = await axios.post("/api/apps", appData);
        console.log("Response", response.data);
        const appId = response.data._id;
        router.push(`/${session?.user?.name || "bashy"}/worlds/${appId}/edit`);
        setLoading(false);
      }
    } catch (error) {
      //setError((error as any).response.data.message);
      console.error(error);
    }
  };

  const handleGodPrompt = async () => {
    const response = await fetch("/api/godprompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: createPrompt,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error in GPT API: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Result", result);
    const data = JSON.parse(result);
    console.log("Data", data);
    setName(data.name);
    setDescription(data.description);
    setNodes(data.nodes);
    setEdges(data.edges);
    setUiComponents(data.uiComponents);
    return data;
  };

  return (
    <div className="border border-gray-500 shadow-2xl shadow-indigo-200 rounded-2xl bg-white z-10 p-2 w-96 lg:w-[460px]">
      <div className="p-6 border  border-gray-300 rounded-xl">
        <div className="flex  justify-center">
          <p className="p-1 whitespace-pre-wrap bg-gradient-to-r from-orange-500 via-pink-500 to-indigo-500 bg-clip-text text-center text-xl font-bold leading-none tracking-tighter text-transparent">
            Imagine kit
          </p>
          <Sparkles className="h-4 w-4 mt-0.5 text-indigo-500" />
        </div>
        <div className="p-6 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-semibold">Create new world</h1>
          <p className="text-gray-500">
            Build your unique interactive experience
          </p>
        </div>

        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name your world"
          className="mb-2"
        />

        <div className="text-xs text-gray-500 my-1">
          Speak your app to life with the help of gen AI
        </div>
        <GodPromptDialog
          setCreatePrompt={setCreatePrompt}
          loading={loading}
          handleSubmit={handleSubmit}
        />

        {!loading && (
          <Button
            onClick={handleSubmit}
            className="w-full mt-2  bg-indigo-500 hover:bg-indigo-600"
          >
            Create World
          </Button>
        )}
        {loading && (
          <Button disabled className="w-full mt-2  bg-indigo-500">
            Loading...
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreateAppForm;
