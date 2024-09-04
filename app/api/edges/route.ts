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
    const { source, target, sourceHandle, targetHandle, app_id } =
      await request.json();

    const edge = new Edge({
      source,
      target,
      sourceHandle,
      targetHandle,
      app_id,
    });

    await edge.save();

    return NextResponse.json(edge, { status: 201 });
  } catch (error: any) {
    console.error("Error creating edge:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
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
