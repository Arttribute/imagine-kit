import OpenAI from "openai";
import { NextResponse } from "next/server";
import {
  AllNodeTypes,
  AllNodeNames,
  AllUIComponentTypes,
} from "@/lib/ptomptEngineering/AllNodeTypes";
import { RuntimeEngineWorking } from "@/lib/ptomptEngineering/RuntimeEngineWorking";

// Initialize OpenAI with your API key
const API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: API_KEY,
});

// Maximum duration for the API response
export const maxDuration = 45;

interface RequestBody {
  message: string;
  nodes: any[];
  edges: any[];
  appData: any;
  interactionData: any;
}

export async function POST(request: Request) {
  try {
    const requestBody: RequestBody = await request.json();
    const { message, nodes, edges, appData, interactionData } = requestBody;

    const prompt = `
      You are Sophia, an AI copilot integrated into a node-based editor called ImagineKit. Your role is to assist users in creating and improving their node diagrams for AI-driven apps.
      The user has provided the following message:
      "${message}"

      The current state of the node editor is as follows:
      - Nodes:
      ${JSON.stringify(nodes, null, 2)}
      - Edges:
      ${JSON.stringify(edges, null, 2)}

      The app metadata is:
      ${JSON.stringify(appData, null, 2)}

      The interaction history is:
      ${JSON.stringify(interactionData, null, 2)}

      Your task is to:
      - Help the user build their desired app on ImagineKit.
      - Analyze the user's message and the current node editor state.
      - Respond to the user appropriately with an explanation and if applicable, a node diagram that best fits their intention .
      - If further information is needed, ask the user for clarification.
      - Provide the node diagram in JSON format, adhering to the following schema:
        {
          "text": "Your explanation to the user.",
          "node_diagram": {
              "nodes": [ ... ],
              "edges": [ ... ]
          }
        }
      - Ensure that the node and edge IDs are unique and do not conflict with existing ones.
      - Always include a textual explanation whnever you generate a node diagram.
      - Inform the user if you realize they are making a mistake or if there is a better way to achieve their goal.

      The response should be a JSON object with the following structure:
      {
        "text": "Your explanation to the user.",
        "node_diagram": {
            "nodes": [ ... ],
            "edges": [ ... ]
        }
      }

      The "text" should be short, simple, informative, and engaging to the user.
      The "node_diagram" could be empty if no changes are needed, depending on the user's message.
      Sometimes the user might ask for ideas and just chat with you; in that case, you can just chat back with them without providing a node diagram immediately.
      So in cases where you don't have any suggestions for the node diagram, you can just chat with the user.
      In the case you provide a node diagram, provide the full flow of the diagram with all the nodes and edges and keep the text VERY VERY SHORT and focus on the node diagram - if the user needs more explanation they can ask you.
      Make sure the node diagram is in a position where the user can easily see (preferably center of the canvas) and it is not cluttered.

      The following are the node types that are available:
        ${AllNodeTypes}

      The following are the node names that are available:
        ${AllNodeNames}

      The following are the uiComponents types that are available:
        ${AllUIComponentTypes}

      DO NOT GO OUTSIDE THE SCOPE OF THE NODE TYPES, NODE NAMES PROVIDED

      It is also VERY IMPORTANT you have a comprehensive understanding of how the runtime engine works in order to create a functional app and avoid errors.
      Here is a brief overview of how the runtime engine works:
      ${RuntimeEngineWorking}
      You need to understand how the nodes interact with each other and how the data flows through the edges and avoid creating any conflicts in the data flow. For example, one node output should not be connected to another node output or to itself. An input node should always be connected to an output node, and one input node cannot be connected to multiple output nodes.

      Try and understand what the user is trying to achieve. Ask questions if you need more information and do not work with vague assumptions. If you make any assumptions, state them clearly in your response.
    `;

    const encoder = new TextEncoder();

    // Create a ReadableStream that streams tokens from OpenAI
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await openai.chat.completions.create({
            model: "gpt-4o-mini-2024-07-18",
            messages: [
              {
                role: "system",
                content: prompt,
              },
            ],
            temperature: 0.7,
            max_tokens: 16384,
            stream: true,
          });

          // Iterate over the async response stream
          for await (const chunk of response) {
            // Each chunk may include a delta token (if provided)
            const token = chunk.choices[0].delta?.content;
            if (token) {
              controller.enqueue(encoder.encode(token));
            }
          }
        } catch (error) {
          console.error("Error during streaming:", error);
          controller.error(error);
        }
        controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
