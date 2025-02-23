// File: /app/api/llm/gpt/route.ts (or similar)
import OpenAI from "openai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: API_KEY,
});

export const revalidate = 0;
export const maxDuration = 45;

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const {
      instruction,
      externalContextText,
      externalContextSnapshot,
      inputs,
      outputs,
      memory,
      image,
    } = requestBody;

    // Build the prompt that instructs the model on context and output format.
    const prompt = `
      You are an assistant designed to output JSON.
      Follow this instruction: ${instruction}

      Here is some context: ${externalContextText}
      Here is the past interaction data: ${JSON.stringify(memory)}

      If the context is present and not empty it means the user is currently on a webpage and you need to provide a response relevant to that context.

      The past interaction data is provided so that you do not repeat yourself.
      Strictly use the past interaction data to provide an appropriate response.

      And you should output the JSON in the following format:
      ${outputs}
      Note: the output fields in the JSON should be of string type.
    `;

    // Build the user content array.
    type UserContent =
      | { type: "text"; text: string }
      | { type: "image_url"; image_url: { url: string } };

    const userContent: UserContent[] = [{ type: "text", text: inputs }];
    if (image) {
      userContent.push({ type: "image_url", image_url: { url: image } });
    }
    if (externalContextSnapshot) {
      userContent.push({
        type: "image_url",
        image_url: { url: externalContextSnapshot },
      });
    }

    // Dynamically build a Zod schema from the outputs parameter.
    // This handles:
    //   • JSON objects (e.g. '{"key":"", "other":""}')
    //   • Comma-separated strings (e.g. "story, image_prompt")
    //   • Single field strings (e.g. "prompt")
    let dynamicSchema;
    if (typeof outputs === "string") {
      const trimmed = outputs.trim();
      if (trimmed.startsWith("{")) {
        // Attempt to parse as a JSON object definition.
        const parsed = JSON.parse(trimmed);
        if (
          typeof parsed === "object" &&
          parsed !== null &&
          !Array.isArray(parsed)
        ) {
          const schemaShape = Object.keys(parsed).reduce((acc, key) => {
            acc[key] = z.string();
            return acc;
          }, {} as Record<string, z.ZodTypeAny>);
          dynamicSchema = z.object(schemaShape);
        } else {
          // Fallback: treat outputs as a single key.
          dynamicSchema = z.object({ [trimmed]: z.string() });
        }
      } else if (trimmed.includes(",")) {
        // If outputs is a comma-separated list, split and create a schema with each field.
        const keys = trimmed.split(",").map((s) => s.trim());
        const schemaShape = keys.reduce((acc, key) => {
          // Optional: map "image_prompt" to "description" if you want a different key name.
          if (key === "image_prompt") {
            acc["description"] = z.string();
          } else {
            acc[key] = z.string();
          }
          return acc;
        }, {} as Record<string, z.ZodTypeAny>);
        dynamicSchema = z.object(schemaShape);
      } else {
        // Otherwise, assume it's a single field name.
        dynamicSchema = z.object({ [trimmed]: z.string() });
      }
    } else if (typeof outputs === "object" && outputs !== null) {
      const schemaShape = Object.keys(outputs).reduce((acc, key) => {
        acc[key] = z.string();
        return acc;
      }, {} as Record<string, z.ZodTypeAny>);
      dynamicSchema = z.object(schemaShape);
    } else {
      throw new Error("Invalid outputs structure provided");
    }

    // Call the OpenAI chat completion endpoint with structured outputs.
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: userContent },
      ],
      temperature: 0.2,
      max_tokens: 128000,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      response_format: zodResponseFormat(dynamicSchema, "result"),
    });

    // Return the parsed structured output.
    return new NextResponse(
      JSON.stringify(response.choices[0].message.content),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
