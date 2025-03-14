import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ArrowUp, Loader2 } from "lucide-react";

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

        await axios.post("/api/nodes", { nodes: nodeData });
        await axios.post("/api/edges", { edges: edgeData });

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

    let resultText = await response.json();
    console.log("Result text", resultText);

    // Clean up extra markdown formatting if present
    resultText = resultText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const result = JSON.parse(resultText);

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
      <div className="rounded-xl border-2 bg-white border-indigo-500">
        <textarea
          ref={(el) => {
            if (el) {
              el.style.height = "auto";
              el.style.height = `${el.scrollHeight}px`;
            }
          }}
          className="h-12 text-sm w-full h-16 p-2 rounded-xl resize-none focus:outline-none focus:border-transparent"
          placeholder="Describe what you want to create..."
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            setCreatePrompt(e.target.value);
            e.target.style.height = "auto"; // Reset height to auto to recalculate
            e.target.style.height = `${e.target.scrollHeight}px`; // Set new height based on scroll height
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // Prevents new line

              if (prompt.trim() !== "") {
                handleSubmit(); // Submit only if the prompt is not empty
              }
            }
          }}
        />
        <div className="flex justify-between items-center mr-1">
          <div className="ml-auto">
            {!loading && (
              <button
                onClick={handleSubmit}
                className=" bg-indigo-500 rounded-xl hover:bg-indigo-600 p-1"
                disabled={!prompt} // Disable the button if prompt is empty
              >
                <ArrowUp className="h-4 w-4 text-white" />
              </button>
            )}
            {loading && (
              <button disabled className=" bg-indigo-500 rounded-xl p-1">
                <Loader2 className="h-4 w-4 text-white animate-spin" />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center gap-2">
        <button
          className="flex w-36 border border-indigo-500 text-indigo-500 text-xs rounded-xl px-2 py-1.5 mt-2"
          onClick={() => {
            const newPrompt =
              "Build a simple chat app that allows real-time messaging with an AI. Include a basic UI for sending and receiving messages.";
            setPrompt(newPrompt);
            setCreatePrompt(newPrompt);
          }}
        >
          <p>Simple chat app</p>
          <ArrowUp className="h-4 w-4 ml-auto" />
        </button>

        <button
          className="flex w-36 border border-indigo-500 text-indigo-500 text-xs rounded-xl px-2 py-1.5 mt-2"
          onClick={() => {
            const newPrompt =
              "Create a sketch-to-image AI app using a diffusion model. Provide a UI for users to upload sketches and convert them into images.";
            setPrompt(newPrompt);
            setCreatePrompt(newPrompt);
          }}
        >
          <p>Sketch to image</p>
          <ArrowUp className="h-4 w-4 ml-auto" />
        </button>

        <button
          className="flex w-36 border border-indigo-500 text-indigo-500 text-xs rounded-xl px-2 py-1.5 mt-2"
          onClick={() => {
            const newPrompt =
              "Develop a language learning AI that helps users practice conversations in real-time. Include lessons, quizzes, and progress tracking.";
            setPrompt(newPrompt);
            setCreatePrompt(newPrompt);
          }}
        >
          <p>Language learning</p>
          <ArrowUp className="h-4 w-4 ml-auto" />
        </button>

        <button
          className="flex w-36 border border-indigo-500 text-indigo-500 text-xs rounded-xl px-2 py-1.5 mt-2"
          onClick={() => {
            const newPrompt =
              "Create an AI story teller app that generates short stories based on a user's prompt or idea.";
            setPrompt(newPrompt);
            setCreatePrompt(newPrompt);
          }}
        >
          <p>Story teller AI</p>
          <ArrowUp className="h-4 w-4 ml-auto" />
        </button>
      </div>
    </div>
  );
}
