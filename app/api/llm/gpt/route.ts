import OpenAI from "openai";
import { NextResponse } from "next/server";

const API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: API_KEY,
});

export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const { instruction, inputs, outputs, memory, image } = requestBody;
    console.log("memory", memory);

    const prompt = `
      You are an assistant designed to output JSON.
      Your goal is to ${instruction}

      This is the input: ${inputs}
      
      The previous interaction data is provided so that you do not repeat yourself or ask unecessary questions. That means you need to keep track of the input you got and the outputs you provided inorder to provide a relevant response.
      previous_interatioction_data=${memory}
      

      and you should output the json in the following format:
      ${outputs}
    `;

    type UserContent =
      | { type: "text"; text: string }
      | { type: "image_url"; image_url: { url: string } };

    const userContent: UserContent[] = [
      {
        type: "text",
        text: inputs,
      },
    ];

    if (image) {
      userContent.push({ type: "image_url", image_url: { url: image } });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: userContent,
        },
      ],
      temperature: 0.2,
      max_tokens: 1600,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    return new NextResponse(
      JSON.stringify(response.choices[0].message.content),
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
