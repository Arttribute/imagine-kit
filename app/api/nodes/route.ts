// app/api/nodes/route.ts
import dbConnect from "@/lib/dbConnect";
import Node from "@/models/Node";
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
    const { node_id, type, name, data, position, app_id } =
      await request.json();

    const node = new Node({
      node_id,
      type,
      name,
      data,
      position,
      app_id,
    });

    await node.save();

    return NextResponse.json(node, { status: 201 });
  } catch (error: any) {
    console.error("Error creating node:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * PUT /api/nodes/:id - Update a node by ID
 */
export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Node ID is required" }, { status: 400 });
  }

  try {
    await dbConnect();
    const data = await request.json();
    const updatedNode = await Node.findByIdAndUpdate(id, data, { new: true });

    if (!updatedNode) {
      return NextResponse.json({ error: "Node not found" }, { status: 404 });
    }

    return NextResponse.json(updatedNode, { status: 200 });
  } catch (error: any) {
    console.error("Error updating node:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/nodes/:id - Delete a node by ID
 */
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Node ID is required" }, { status: 400 });
  }

  try {
    await dbConnect();
    const deletedNode = await Node.findByIdAndDelete(id);

    if (!deletedNode) {
      return NextResponse.json({ error: "Node not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Node deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting node:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
