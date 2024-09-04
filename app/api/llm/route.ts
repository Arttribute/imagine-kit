import OpenAI from "openai";
import { NextResponse } from "next/server";

const API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: API_KEY,
});

export async function POST(request: Request) {
  try {
    const requestbody = await request.json();
    const { instruction, inputs, outputs } = requestbody;

    const prompt = `
    You are an assistant designed to output JSON.
    Your goal is to  ${instruction}

    This is the input: ${inputs}

    and you should output the json on the following format:
    ${outputs}
    
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: prompt,
        },
        { role: "user", content: inputs },
      ],
      temperature: 1,
      max_tokens: 1600,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    return new NextResponse(response.choices[0].message.content, {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse(error.message, {
      status: 500,
    });
  }
}
