// app/api/nodes/route.ts
import dbConnect from "@/lib/dbConnect";
import Node from "@/models/Node";
import Edge from "@/models/Edge";
import UIComponent from "@/models/UIComponent";
import { NextResponse } from "next/server";

/**
 * GET /api/nodes - Get all nodes
 */
export async function GET() {
  try {
    await dbConnect();
    const nodes = await Node.find().sort({ createdAt: -1 });
    return NextResponse.json(nodes, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching nodes:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/nodes - Create a new node
 */
export async function POST(request: Request) {
  try {
    await dbConnect();
    const { nodes } = await request.json(); // Destructure nodes array from request

    if (!nodes || !Array.isArray(nodes)) {
      return new NextResponse("Invalid nodes data", { status: 400 });
    }

    const savedNodes = await Promise.all(
      nodes.map(async (nodeData) => {
        const { node_id, type, name, data, position, app_id } = nodeData;

        // Validate and save each node
        if (!node_id || !type || !name || !position || !app_id) {
          throw new Error("Missing required node fields.");
        }

        return Node.findOneAndUpdate(
          { node_id, app_id },
          { type, name, data, position, app_id },
          { upsert: true, new: true, runValidators: true }
        );
      })
    );

    return new NextResponse(JSON.stringify(savedNodes), { status: 200 });
  } catch (error: any) {
    console.error("Error creating nodes:", error.message);
    return new NextResponse(error.message, { status: 500 });
  }
}

/**
 * DELETE /api/nodes/:id - Delete a node by ID
 */
// app/api/nodes/route.ts

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const nodeId = searchParams.get("id"); // This is now the `node_id`
  const appId = searchParams.get("appId");

  if (!nodeId) {
    return NextResponse.json({ error: "Node ID is required" }, { status: 400 });
  }

  if (!appId) {
    return NextResponse.json({ error: "App ID is required" }, { status: 400 });
  }

  try {
    await dbConnect();

    // Find the node using `node_id` instead of `_id`
    const nodeToDelete = await Node.findOne({ node_id: nodeId, app_id: appId });
    if (!nodeToDelete) {
      return NextResponse.json({ error: "Node not found" }, { status: 404 });
    }

    // Delete corresponding edges
    await Edge.deleteMany({
      $or: [{ source: nodeId }, { target: nodeId }],
      app_id: appId,
    });

    // Delete corresponding UI component
    await UIComponent.deleteOne({ component_id: nodeId, app_id: appId });

    // Delete the node itself
    await Node.deleteOne({ node_id: nodeId, app_id: appId });

    return NextResponse.json(
      { message: "Node and related data deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting node and related data:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
