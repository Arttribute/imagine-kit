// app/api/download/route.ts
import { NextResponse } from "next/server";

/**
 * GET /api/download-image?url=...&filename=...
 *
 * - url:   URL of the image to fetch
 * - filename: (optional) desired filename for the downloaded image
 *
 * Returns the remote image with "Content-Disposition: attachment" headers,
 * prompting a file download in most browsers.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url"); // Image URL
    const filename = searchParams.get("filename") || "download.png";

    if (!url) {
      return new NextResponse("Missing 'url' parameter.", { status: 400 });
    }

    // Fetch the actual image from the provided URL
    const response = await fetch(url);
    if (!response.ok) {
      return new NextResponse("Failed to fetch the image.", { status: 500 });
    }

    // Extract the content type from the response
    const contentType =
      response.headers.get("content-type") || "application/octet-stream";

    // Convert the response to a Blob, then get the array buffer
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();

    // Force file download by specifying Content-Disposition
    const headers = new Headers({
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
    });

    // Return the file as NextResponse
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error in /api/download-image route:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
