import OpenAI from "openai";
import { NextResponse } from "next/server";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

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

const API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: API_KEY });

export const maxDuration = 45;

const InputOutputSchema = z
  .object({
    id: z.string(),
    label: z.string(),
    value: z.string(),
    color: z.string(),
    type: z.string(),
  })
  .strict();

const NodeSchema = z
  .object({
    node_id: z.string(),
    type: z.string(),
    name: z.string(),
    data: z
      .object({
        inputs: z.array(InputOutputSchema),
        outputs: z.array(InputOutputSchema),
        instruction: z.string(),
        memoryFields: z.array(InputOutputSchema),
      })
      .strict(),
    position: z
      .object({
        x: z.number(),
        y: z.number(),
      })
      .strict(),
  })
  .strict();

const EdgeSchema = z
  .object({
    source: z.string(),
    target: z.string(),
    sourceHandle: z.string(),
    targetHandle: z.string(),
  })
  .strict();

const UIComponentSchema = z
  .object({
    component_id: z.string(),
    type: z.string(),
    label: z.string(),
    position: z
      .object({
        x: z.number(),
        y: z.number(),
        width: z.number(),
        height: z.number(),
      })
      .strict(),
  })
  .strict();

const AppSchema = z
  .object({
    name: z.string(),
    description: z.string(),
    explaintext: z.string(),
    nodes: z.array(NodeSchema),
    edges: z.array(EdgeSchema),
    uiComponents: z.array(UIComponentSchema),
  })
  .strict();
export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const { input } = requestBody;

    const prompt = `
    You are an AI assistant that generates AI-driven apps in JSON format.
    Your goal is to take the user's input of the desired app and return nodes, edges, and UI components in structured JSON format.

    The user input: ${input}

    The following is the data model for the output:

    Nodes:
    ${AllNodeTypes}

    Node Names:
    ${AllNodeNames}

    UI Component Types:
    ${AllUIComponentTypes}

    - Nodes must have unique IDs (e.g., "LLMNode-1", "ImageGen-2").
    - Nodes should be structured based on the schema provided.
    - Edges should connect valid inputs and outputs without loops.
    - Please note that UI nodes must have their corresponding UI components.
    - UI components should be included where relevant.
    - Posittion the UI components in an appealing way. You can look at the examples below for reference on how to best position the UI components.
    
    Reference examples:
    ${SketchAppExample}
    ${TextToImageExample}
    ${AITarotExample}
    ${MosaicsExample}

    Be sure to follow the runtime engine rules: ${RuntimeEngineWorking}
    Also provide a very brief explanation of what you did eg "Here is a simple app that...It has...which works by...".
    `;

    const response = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: input },
      ],
      response_format: zodResponseFormat(AppSchema, "structured_output"),
      temperature: 1,
      max_tokens: 16384,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    const structuredOutput = response.choices[0].message.parsed;

    return new NextResponse(JSON.stringify(structuredOutput), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: (error as any).message }), {
      status: 500,
    });
  }
}
