// app/api/apps/route.ts
import dbConnect from "@/lib/dbConnect";
import App from "@/models/App";
import { NextResponse } from "next/server";

/**
 * GET /api/apps - Get all apps
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const _id = searchParams.get("appId");
  try {
    await dbConnect();
    const app = await App.findOne({ _id })
      .populate("owner")
      .sort({ createdAt: -1 });
    return NextResponse.json(app, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching apps:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * PUT /api/apps - Update an app
 */

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("appId");
  console.log("id", id);
  try {
    await dbConnect();
    const { detailsToUpdate } = await request.json();
    console.log("detailsToUpdate", detailsToUpdate);
    const updatedApp = await App.findByIdAndUpdate(id, detailsToUpdate, {
      new: true,
    });
    console.log("Updated app", updatedApp);
    return NextResponse.json(updatedApp, { status: 200 });
  } catch (error: any) {
    console.error("Error updating app:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
