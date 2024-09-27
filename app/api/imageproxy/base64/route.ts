import { NextResponse } from "next/server";

/**
 * GET /api/imageproxy - Convert an image URL to base64
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("imageUrl");

  if (!imageUrl) {
    return NextResponse.json(
      { error: "Image URL is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch the image");
    }

    // Get the image as a buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert buffer to base64
    const base64String = buffer.toString("base64");

    // Return the base64 string
    return NextResponse.json({ base64: base64String }, { status: 200 });
  } catch (error: any) {
    console.error("Error converting image to base64:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
