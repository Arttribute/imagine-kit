// app/api/buildchat/route.ts
import dbConnect from "@/lib/dbConnect";
import BuildChatInteraction from "@/models/BuildChatInteraction";
import { NextResponse } from "next/server";

export const revalidate = 0;
/**
 * GET /api/buildchat - Get app user interactions
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const app_id = searchParams.get("appId");
  const user_id = searchParams.get("userId");
  try {
    await dbConnect();
    const interactions = await BuildChatInteraction.find({
      app_id,
      owner: user_id,
    }).sort({ createdAt: -1 });
    return NextResponse.json(interactions, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching interactions:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/buildchat - Create build chat interaction
 */
export async function POST(request: Request) {
  try {
    await dbConnect();
    const { interactionData } = await request.json();
    // Validate that owner and app_id are provided
    if (!interactionData.owner || !interactionData.app_id) {
      return NextResponse.json(
        { error: "Owner and app_id are required" },
        { status: 400 }
      );
    }
    const interaction = new BuildChatInteraction(interactionData);
    await interaction.save();
    return NextResponse.json(interaction, { status: 201 });
  } catch (error: any) {
    console.error("Error creating interaction:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
