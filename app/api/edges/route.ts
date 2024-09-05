// app/api/edges/route.ts
import dbConnect from "@/lib/dbConnect";
import Edge from "@/models/Edge";
import { NextResponse } from "next/server";

/**
 * GET /api/edges - Get all edges
 */
export async function GET() {
  try {
    await dbConnect();
    const edges = await Edge.find().sort({ createdAt: -1 });
    return NextResponse.json(edges, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching edges:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/edges - Create a new edge
 */
export async function POST(request: Request) {
  try {
    await dbConnect();
    const { edges } = await request.json(); // Destructure edges array from request

    if (!edges || !Array.isArray(edges)) {
      return new NextResponse("Invalid edges data", { status: 400 });
    }

    const savedEdges = await Promise.all(
      edges.map(async (edgeData) => {
        const { source, target, sourceHandle, targetHandle, app_id } = edgeData;

        // // Validate and save each edge
        // if (!source || !target || !sourceHandle || !targetHandle || !app_id) {
        //   const missingFields = Object.entries(edgeData);
        //   throw new Error("Missing required edge fields." + missingFields);
        // }

        return Edge.findOneAndUpdate(
          { source, target, sourceHandle, targetHandle, app_id },
          { source, target, sourceHandle, targetHandle, app_id },
          { upsert: true, new: true, runValidators: true }
        );
      })
    );

    return new NextResponse(JSON.stringify(savedEdges), { status: 200 });
  } catch (error: any) {
    console.error("Error creating edges:", error.message);
    return new NextResponse(error.message, { status: 500 });
  }
}

/**
 * DELETE /api/edges/:id - Delete an edge by ID
 */
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Edge ID is required" }, { status: 400 });
  }

  try {
    await dbConnect();
    const deletedEdge = await Edge.findByIdAndDelete(id);

    if (!deletedEdge) {
      return NextResponse.json({ error: "Edge not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Edge deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting edge:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
