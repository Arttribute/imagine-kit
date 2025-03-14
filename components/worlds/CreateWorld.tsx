import { Button } from "@/components/ui/button";

import { Textarea } from "@/components/ui/textarea";
import TypingAnimation from "@/components/magicui/typing-animation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { text } from "stream/consumers";

export default function CreatWorld({}: {}) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [createPrompt, setCreatePrompt] = useState("");
  const [name, setName] = useState("");
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [uiComponents, setUiComponents] = useState([]);
  const [error, setError] = useState("");
  const { data: session }: any = useSession();
  const router = useRouter();

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    setCreatePrompt(e.target.value);
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const appData = {
        owner: session.user.id,
        name,
        description,
      };

      if (createPrompt !== "") {
        const genData = await handleGodPrompt();
        const generatedappData = {
          owner: session.user.id,
          name: genData.name || "Untitled",
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
        // const uiComponentsToSave = genData.uiComponents.map(
        //   (uiComponent: any) => ({
        //     ...uiComponent,
        //     app_id: appId,
        //   })
        // );

        await axios.post("/api/nodes", { nodes: nodeData });
        await axios.post("/api/edges", { edges: edgeData });
        // await axios.post("/api/uicomponents", {
        //   uiComponents: uiComponentsToSave,
        // });

        // Save the complete chat interaction to the history
        const interactionToSave = {
          owner: session.user.id,
          app_id: appId,
          user_message: createPrompt,
          system_message: {
            text: genData.description,
            node_diagram: {
              nodes: genData.nodes,
              edges: genData.edges,
              uiComponents: genData.uiComponents,
            },
          },
        };

        await fetch("/api/buildchat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ interactionData: interactionToSave }),
        });
        router.push(`/${session.user.username || "b"}/worlds/${appId}/edit`);
        setLoading(false);
      } else {
        console.log("App data", appData);
        const response = await axios.post("/api/apps", appData);
        console.log("Response", response.data);
        const appId = response.data._id;
        router.push(`/${session.user.username || "b"}/worlds/${appId}/edit`);
        setLoading(false);
      }
    } catch (error) {
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

    let resultText = await response.json(); // Get the result as plain text first
    console.log("Result text", resultText);
    resultText = resultText
      .replace(/```json/g, "") // Remove "```json" if present
      .replace(/```/g, "") // Remove trailing "```"
      .trim();

    const result = JSON.parse(resultText); // Now parse it as JSON

    console.log("Result", result);
    console.log("Result", result.nodes);
    console.log("Result", result.edges);
    console.log("Result", result.uiComponents);
    console.log("Result", result.name);

    setName(result.name);
    setDescription(result.description);
    setNodes(result.nodes);
    setEdges(result.edges);
    setUiComponents(result.uiComponents);

    return result;
  };

  return (
    <div>
      <textarea
        //do not highlight on focus
        className="w-full h-30 p-2 border-2 border-indigo-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        placeholder="Describe what you want to create..."
        value={prompt}
        onChange={handlePromptChange}
      />

      {!loading && (
        <Button
          onClick={handleSubmit}
          className="w-full mt-2 bg-indigo-500 hover:bg-indigo-600"
          disabled={!prompt} // Disable the button if prompt is empty
        >
          Create World
        </Button>
      )}
      {loading && (
        <Button disabled className="w-full mt-2 bg-indigo-500">
          Loading...
        </Button>
      )}
    </div>
  );
}
