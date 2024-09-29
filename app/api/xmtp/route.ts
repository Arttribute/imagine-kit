import axios from "axios";
import { NextResponse } from "next/server";

// Types for node, edge, and UI component data
interface NodeData {
  node_id: string;
  type: string;
  name: string;
  data: {
    inputs: { id: string; label: string; value: string }[];
    outputs: { id: string; label: string; value: string }[];
    instruction?: string;
    memoryFields?: { id: string; label: string; value: string }[];
  };
  position: {
    x: number;
    y: number;
  };
  app_id: string;
}

interface EdgeData {
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
  app_id: string;
}

export async function callDalleApi(prompt: string): Promise<string> {
  try {
    const response = await fetch("http://localhost:3000/api/imagegen/dalle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: prompt }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate image: ${response.statusText}`);
    }

    const imageUrl = await response.json();
    return imageUrl; // Assuming the API returns the image URL directly
  } catch (error) {
    console.error("Error generating images:", error);
    throw error;
  }
}

export async function callGPTApi(
  instruction: string,
  inputs: string,
  outputs: string
) {
  try {
    const response = await fetch("http://localhost:3000/api/llm/gpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        instruction,
        inputs,
        outputs,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error in GPT API: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error calling GPT API:", error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const { appId, input } = requestBody;

    const [nodesResponse, edgesResponse, uiComponentsResponse] =
      await Promise.all([
        axios.get(`http://localhost:3000/api/nodes?appId=${appId}`),
        axios.get(`http://localhost:3000/api/edges?appId=${appId}`),
        axios.get(`http://localhost:3000/api/uicomponents?appId=${appId}`),
      ]);

    let nodes: NodeData[] = nodesResponse.data;
    let edges: EdgeData[] = edgesResponse.data;

    let executedNodes: Set<string> = new Set();
    let nodeOutputs: { [key: string]: any } = {};

    const executeNode = async (node: NodeData) => {
      if (executedNodes.has(node.node_id)) return; // Skip if node has already been executed
      switch (node.type) {
        case "llm":
          await executeLLMNode(node); // Execute LLM Node
          break;
        case "imageGen":
          await executeImageGeneratorNode(node); // Execute Image Generator Node
          break;
        case "xmtp":
          await executeXMTPNode(node); // Execute XMTP Node
          break;
        // Add more cases for each node type
        default:
          console.warn(`Unknown node type: ${node.type}`);
          break;
      }

      executedNodes = new Set(executedNodes).add(node.node_id); // Mark node as executed
    };

    const executeXMTPNode = async (node: NodeData) => {
      console.log("XMTP submitted for node", node.node_id);
      //reset executed nodes
      executedNodes = new Set();

      // Find all edges connected to this node's output and propagate data
      const connectedEdges = edges.filter(
        (edge) => edge.source === node.node_id
      );
      connectedEdges.forEach((edge) => {
        const targetNodeIndex = nodes.findIndex(
          (node) => node.node_id === edge.target
        );

        if (targetNodeIndex !== -1) {
          const targetInputIndex = nodes[targetNodeIndex].data.inputs.findIndex(
            (input) => input.id === edge.targetHandle
          );

          if (targetInputIndex !== -1) {
            nodes[targetNodeIndex].data.inputs[targetInputIndex].value =
              node.data.outputs[0].value;

            // Trigger a re-render to propagate the data change
            //setNodes([...nodes]);
            console.log(
              "Propagating data from",
              node.node_id,
              "to",
              edge.target
            );
            console.log("New value:", node.data.outputs[0].value);
            console.log("New node data:", nodes);
            // Execute the target node after updating its input
            executeNode(nodes[targetNodeIndex]);
          }
        }
      });
    };

    const executeLLMNode = async (node: NodeData) => {
      const promptInput = node.data.inputs[0]?.value || "start";
      const promptLabel = node.data.inputs[0]?.label;
      console.log({ promptInput, promptLabel });
      if (!promptInput) return;
      //if the prompt input is the same as the prompt label ut means that the user has not made an input then return
      if (promptInput === promptLabel) return;

      const { instruction, inputs, outputs } = node.data;

      // Get input values from the node's inputs
      const inputValues = inputs.map((input) => input.value).join(" ");

      // Prepare the outputs format
      const outputFormat = outputs.map((output) => output.label).join(", ");

      try {
        // Call the LLM API
        const generatedOutput = await callGPTApi(
          instruction ?? "",
          inputValues,
          outputFormat
        );

        // Assume the API returns output in JSON format that matches the requested output format
        const outputData = JSON.parse(generatedOutput);
        console.log("LLM Node output:", outputData);

        //Update the node's output value with the corresponding output eg if output =={sentence: "Hello World"} then the node data with the sentence label will be updated with the value "Hello World" ie node.data.outputs[label].value = output.sentence
        nodes = nodes.map((n) =>
          n.node_id === node.node_id
            ? {
                ...n,
                data: {
                  ...n.data,
                  outputs: n.data.outputs.map((output) => ({
                    ...output,
                    value: outputData[output.label],
                  })),
                },
              }
            : n
        );
        // Find all edges connected to this node's output and propagate data and update the connected node input with the output value
        const connectedEdges = edges.filter(
          (edge) => edge.source === node.node_id
        );
        connectedEdges.forEach((edge) => {
          const targetNodeIndex = nodes.findIndex(
            (node) => node.node_id === edge.target
          );

          console.log("Connected Edges:", connectedEdges);
          console.log("LLM Target Node Index:", targetNodeIndex);
          if (targetNodeIndex !== -1) {
            const targetInputIndex = nodes[
              targetNodeIndex
            ].data.inputs.findIndex((input) => input.id === edge.targetHandle);
            console.log("LLM Target Input Index:", targetInputIndex);

            if (targetInputIndex !== -1) {
              //get node output label
              const label =
                nodes[targetNodeIndex].data.inputs[targetInputIndex].label;
              console.log("LLM Target Input Label:", label);
              nodes[targetNodeIndex].data.inputs[targetInputIndex].value =
                outputData[label];
              console.log("LLM Target Input Value:", outputData[label]);
              console.log(
                " Edge:",
                edge,
                "Edge target handle",
                edge.targetHandle
              );

              // Trigger a re-render to propagate the data change
              //   setNodes([...nodes]);

              // Execute the target node after updating its input
              executeNode(nodes[targetNodeIndex]);
            }
          }
        });
      } catch (error) {
        console.error(`Error executing LLM Node (${node.node_id}):`, error);
      }
    };

    const executeImageGeneratorNode = async (node: NodeData) => {
      const promptInput = node.data.inputs[0].value;
      const promptLabel = node.data.inputs[0].label;
      if (!promptInput) return;
      //if the prompt input is the same as the prompt label ut means that the user has not made an input then return
      if (promptInput === promptLabel) return;

      try {
        // Call DALL-E API to generate image
        console.log("Generating image with prompt", promptInput);
        const generatedImageUrl = await callDalleApi(promptInput);
        console.log("Image Generator Node output:", generatedImageUrl);
        // Update the node's outputs with the generated image URL
        nodes = nodes.map((n) =>
          n.node_id === node.node_id
            ? {
                ...n,
                data: {
                  ...n.data,
                  outputs: n.data.outputs.map((output) =>
                    output.id === "output-0"
                      ? { ...output, value: generatedImageUrl }
                      : output
                  ),
                },
              }
            : n
        );

        // Propagate the output to connected nodes
        const connectedEdges = edges.filter(
          (edge) => edge.source === node.node_id
        );
        connectedEdges.forEach((edge) => {
          const targetNodeIndex = nodes.findIndex(
            (node) => node.node_id === edge.target
          );

          console.log("Connected Edges:", connectedEdges);
          console.log("ImageGen Target Node Index:", targetNodeIndex);
          if (targetNodeIndex !== -1) {
            const targetInputIndex = nodes[
              targetNodeIndex
            ].data.inputs.findIndex((input) => input.id === edge.targetHandle);
            console.log("ImageGenTarget Input Index:", targetInputIndex);

            if (targetInputIndex !== -1) {
              nodes[targetNodeIndex].data.inputs[targetInputIndex].value =
                generatedImageUrl;

              // Trigger a re-render to propagate the data change
              // setNodes([...nodes]);

              // Execute the target node after updating its input
              executeNode(nodes[targetNodeIndex]);
            }
          }
        });
      } catch (error) {
        console.error(
          `Error executing Image Generator Node (${node.node_id}):`,
          error
        );
      }
    };

    const runApp = async () => {
      console.log(nodes);
      // Execute start nodes first
      for (let node of nodes.filter((node) => node.type == "xmtp")) {
        node.data.outputs = [
          {
            id: node.data.outputs[0].id,
            label: node.data.outputs[0].label,
            value: input,
          },
        ];
        nodes = nodes.map((n) => (n.node_id === node.node_id ? node : n));
        await executeNode(node);
      }

      // Execute nodes with inputs next
      for (const node of nodes.filter((node) => node.data.inputs.length > 0)) {
        await executeNode(node);
      }
      console.log("Executed nodes:", executedNodes);
      console.log("Nodes:", nodes);
      console.log("All nodes executed!");

      //   console.log(nodes.find((node) => node.type === "llm")?.data.outputs);
      //   console.log(nodes.find((node) => node.type === "xmtp")?.data.inputs);

      // After all nodes are executed, connect outputs to inputs via edges
      connectNodesWithEdges();
    };

    const connectNodesWithEdges = () => {
      // Logic to connect nodes' outputs to the inputs of other nodes
      edges.forEach((edge) => {
        const sourceOutput = nodeOutputs[edge.source]?.[edge.sourceHandle];
        if (sourceOutput) {
          const targetNodeIndex = nodes.findIndex(
            (node) => node.node_id === edge.target
          );

          if (targetNodeIndex !== -1) {
            const targetInputIndex = nodes[
              targetNodeIndex
            ].data.inputs.findIndex((input) => input.id === edge.targetHandle);

            if (targetInputIndex !== -1) {
              nodes[targetNodeIndex].data.inputs[targetInputIndex].value =
                sourceOutput;

              // Trigger a re-render to propagate the data change
              //   setNodes([...nodes]);
            }
          }
        }
      });
    };

    await runApp();

    return new NextResponse(
      JSON.stringify({
        response: nodes.find((node) => node.type === "xmtp")?.data.inputs[0]
          .value,
      }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
