import OpenAI from "openai";
import { NextResponse } from "next/server";
import {
  SketchAppExample,
  TextToImageExample,
  AITarotExample,
  MosaicsExample,
} from "@/lib/ptomptEngineering/worldExamples";
import { ComponentsFormat } from "@/lib/ptomptEngineering/ComponentsFormat";
import {
  AllNodeTypes,
  AllNodeNames,
  AllUIComponentTypes,
} from "@/lib/ptomptEngineering/AllNodeTypes";
import { RuntimeEngineWorking } from "@/lib/ptomptEngineering/RuntimeEngineWorking";

// Define the JSON Schema for the structured output
const responseSchema = {
  type: "object",
  name: "ResponseSchema",
  properties: {
    text: {
      type: "string",
      description:
        "A short, simple, informative, and engaging explanation to the user.",
    },
    node_diagram: {
      type: "object",
      properties: {
        nodes: {
          type: "array",
          description: "An array of node objects.",
          items: {
            type: "object",
            properties: {
              node_id: { type: "string" },
              type: { type: "string" },
              name: { type: "string" },
              data: {
                type: "object",
                properties: {
                  inputs: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        label: { type: "string" },
                        value: { type: "string" },
                        color: { type: "string" },
                      },
                      required: ["id"],
                      additionalProperties: false,
                    },
                  },
                  outputs: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        label: { type: "string" },
                        value: { type: "string" },
                        color: { type: "string" },
                      },
                      required: ["id"],
                      additionalProperties: false,
                    },
                  },
                  instruction: { type: "string" },
                  memoryFields: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        label: { type: "string" },
                        value: { type: "string" },
                        color: { type: "string" },
                      },
                      required: ["id"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["inputs", "outputs"],
                additionalProperties: false,
              },
              position: {
                type: "object",
                properties: {
                  x: { type: "number" },
                  y: { type: "number" },
                },
                required: ["x", "y"],
                additionalProperties: false,
              },
            },
            required: ["node_id", "type", "name", "data", "position"],
            additionalProperties: false,
          },
        },
        edges: {
          type: "array",
          description: "An array of edge objects.",
          items: {
            type: "object",
            properties: {
              source: { type: "string" },
              target: { type: "string" },
              sourceHandle: { type: "string" },
              targetHandle: { type: "string" },
              color: { type: "string" },
            },
            required: ["source", "target", "sourceHandle", "targetHandle"],
            additionalProperties: false,
          },
        },
      },
      required: ["nodes", "edges"],
      additionalProperties: false,
    },
  },
  required: ["text", "node_diagram"],
  additionalProperties: false,
};

// Initialize OpenAI with your API key
const API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: API_KEY,
});

// Maximum duration for the API response
export const maxDuration = 45;

// Define TypeScript interfaces for Type Safety (optional but recommended)
interface RequestBody {
  message: string;
  nodes: any[];
  edges: any[];
  appData: any;
  interactionData: any;
}

interface StructuredResponse {
  text: string;
  node_diagram: {
    nodes: any[];
    edges: any[];
  };
}

export async function POST(request: Request) {
  try {
    // Parse the incoming JSON request
    const requestBody: RequestBody = await request.json();
    const { message, nodes, edges, appData, interactionData } = requestBody;

    // Construct the prompt for the AI model
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
      - Analyze the user's message and the current node editor state.
      - Generate suggestions to improve or extend the node diagram.
      - Provide the suggestions in JSON format, adhering to the following schema:
        {
          "text": "Your explanation to the user.",
          "node_diagram": {
              "nodes": [ ... ],
              "edges": [ ... ]
          }
        }
      - Ensure that the node and edge IDs are unique and do not conflict with existing ones.
      - Include a textual explanation of your suggestions.
      - Inform the user if they are making a mistake or if there is a better way to achieve their goal.

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

      The following is all you need to know about ImagineKit's Node, Edge, and UIComponent structure:
      Here are the mongoose schemas for Nodes and Edges:
      
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

      Now chat with the user and provide any suggestions if necessary based on the user's message and current node editor state.
    `;

    // Define the JSON Schema for Structured Outputs
    const jsonSchema = responseSchema;

    // Make the API call with Structured Outputs
    const response = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini-2024-07-18", // Ensure using a supported model
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 16384,
      response_format: {
        type: "json_schema",
        json_schema: {
          schema: jsonSchema,
          name: "WorldSchema",
        },
      },
    });

    // Access the parsed response
    const messageResponse = response.choices[0].message.content;

    // Handle refusals
    if (messageResponse && messageResponse.includes("refusal")) {
      return new NextResponse(
        JSON.stringify({ error: "Request was refused by the model." }),
        { status: 200 }
      );
    }

    // Parse the structured response
    const parsedResponse: StructuredResponse = messageResponse
      ? JSON.parse(messageResponse)
      : { text: "", node_diagram: { nodes: [], edges: [] } };

    return new NextResponse(JSON.stringify(parsedResponse), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
