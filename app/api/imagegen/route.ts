import { NextResponse } from "next/server";

const API_KEY = process.env.ASTRIA_API_KEY;
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const prompt_id = searchParams.get("prompt_id");
  const model_id = searchParams.get("model_id");

  const res = await fetch(
    `https://api.astria.ai/tunes/${model_id}/prompts/${prompt_id}`,
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    }
  );
  const data = await res.json();

  return Response.json({ data });
}

export async function POST(request: Request) {
  const { textToImageObject, modelId } = await request.json();

  try {
    const formData = new FormData();
    Object.keys(textToImageObject).forEach((key) => {
      if (textToImageObject[key] !== undefined) {
        formData.append(`prompt[${key}]`, textToImageObject[key]);
      }
    });
    const promptRes = await fetch(
      `https://api.astria.ai/tunes/${modelId}/prompts`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + API_KEY,
        },
        body: formData,
      }
    );
    const text2ImageResponse = await promptRes.json();

    return new NextResponse(JSON.stringify(text2ImageResponse), {
      status: 201,
    });
  } catch (error: any) {
    return new NextResponse(error.message, {
      status: 500,
    });
  }
}
