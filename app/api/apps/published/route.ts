// app/api/apps/route.ts
import dbConnect from "@/lib/dbConnect";
import App from "@/models/App";
import { NextResponse } from "next/server";

/**
 * GET /api/apps - Get only published and public apps
 */
export async function GET() {
  try {
    await dbConnect();
    const apps = await App.find({ is_published: true, is_private: false })
      .populate("owner")
      .sort({ createdAt: -1 });
    return NextResponse.json(apps, {
      status: 200,
    });
  } catch (error: any) {
    console.error("Error fetching apps:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
