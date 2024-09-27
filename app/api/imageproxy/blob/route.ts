import { NextResponse } from "next/server";

/**
 * GET /api/imageproxy/blob - Fetch an image and return it as binary data
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
    // Fetch the image from the provided URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch the image");
    }

    // Convert the image into an ArrayBuffer and then a Buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Return the binary image data
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") || "application/octet-stream",
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("Error fetching image:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
