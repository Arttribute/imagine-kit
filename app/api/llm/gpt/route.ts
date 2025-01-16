import OpenAI from "openai";
import { NextResponse } from "next/server";

const API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: API_KEY,
});

export const revalidate = 0;
export const maxDuration = 45;

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const { instruction, externalContext, inputs, outputs, memory, image } =
      requestBody;

    const prompt = `
      You are an assistant designed to output JSON.
      Follow this intruction: ${instruction}

      Here is some context: ${externalContext}
      Here is the past interaction data: ${JSON.stringify(memory)}

      If the context is present and not empty it means the user is currently on a webpage and you need to provide a response relevant to the webpage context.

      The past interaction data is provided so that you do not repeat yourself. That means you need to keep track of inputs and ouputs of the past interactions to provide a more relevant response.
      Note that In the case of the past interaction data, the inputs are the past data that you have received and the outputs are the responses that you have provided. 
      Strictly use the past interaction data to provide an appropriate response.

      and you should output the json in the following format:
      ${outputs}
      Note: the output fields in the JSON should be of string type.
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
      max_tokens: 16384,
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
