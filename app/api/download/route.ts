// app/api/download/route.ts
import { NextResponse } from "next/server";

/**
 * GET /api/download?url=...&filename=...
 *
 * 1) Attempts to fetch the remote image.
 * 2) If successful, returns the image with "Content-Disposition: attachment"
 *    so the browser prompts a download.
 * 3) If it fails, the endpoint redirects to the raw "url" so the user at least
 *    sees the image in their browser.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    const filename = searchParams.get("filename") || "download.png";

    if (!url) {
      return NextResponse.json(
        { error: "Missing 'url' parameter." },
        { status: 400 }
      );
    }

    // Attempt to fetch the actual image from the provided URL
    const response = await fetch(url);
    if (!response.ok) {
      // Fallback #1: If fetch fails, just redirect user to the raw image URL
      return NextResponse.redirect(url);
    }

    // Convert the fetched image to a Blob, then ArrayBuffer
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();

    // Derive content type from the fetched response
    const contentType =
      response.headers.get("content-type") || "application/octet-stream";

    // Force file download by specifying the Content-Disposition header
    const headers = new Headers({
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
    });

    // Return the file with a forced download header
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error in /api/download route:", error);
    // Fallback #2: If something else goes wrong, direct user to the raw URL again
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url") || "/";
    return NextResponse.redirect(url);
  }
}
