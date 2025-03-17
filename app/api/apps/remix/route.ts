// app/api/apps/[appId]/remix/route.ts

import dbConnect from "@/lib/dbConnect";
import App from "@/models/App";
import Node from "@/models/Node";
import Edge from "@/models/Edge";
import UIComponent from "@/models/UIComponent";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { owner, appId } = await request.json();
  if (!appId) {
    return NextResponse.json(
      { error: "Original app ID is required" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    // 1) Find the original app
    const originalApp = await App.findById(appId);
    if (!originalApp) {
      return NextResponse.json(
        { error: "Original app not found" },
        { status: 404 }
      );
    }

    // 2) Increment original app's remix_count
    originalApp.remix_count = (originalApp.remix_count || 0) + 1;
    await originalApp.save();

    // 3) Create the new app
    const newAppName = originalApp.name + "-remix";
    const newApp = new App({
      owner, // or use the currently logged-in user if needed
      name: newAppName,
      description: originalApp.description,
      banner_url: originalApp.banner_url,
      is_private: originalApp.is_private,
      is_published: false,
      is_remix_of: originalApp._id,
      is_remixable: originalApp.is_remixable,
    });
    await newApp.save();

    // 4) Copy all Nodes over to the new app
    const oldNodes = await Node.find({ app_id: originalApp._id });
    const newNodes = oldNodes.map((oldNode) => ({
      node_id: oldNode.node_id,
      type: oldNode.type,
      name: oldNode.name || oldNode.type,
      data: oldNode.data,
      position: oldNode.position,
      app_id: newApp._id,
    }));
    if (newNodes.length > 0) {
      await Node.insertMany(newNodes);
    }

    // 5) Copy all Edges over to the new app
    const oldEdges = await Edge.find({ app_id: originalApp._id });
    const newEdges = oldEdges.map((oldEdge) => ({
      source: oldEdge.source,
      target: oldEdge.target,
      sourceHandle: oldEdge.sourceHandle,
      targetHandle: oldEdge.targetHandle,
      color: oldEdge.color,
      app_id: newApp._id,
    }));
    if (newEdges.length > 0) {
      await Edge.insertMany(newEdges);
    }

    // 6) Copy all UIComponents over to the new app
    const oldUIComponents = await UIComponent.find({ app_id: originalApp._id });
    const newUIComponents = oldUIComponents.map((oldComp) => ({
      component_id: oldComp.component_id,
      type: oldComp.type,
      label: oldComp.label,
      position: oldComp.position,
      app_id: newApp._id,
    }));
    if (newUIComponents.length > 0) {
      await UIComponent.insertMany(newUIComponents);
    }

    // 7) Return the newly created app
    return NextResponse.json(newApp, { status: 201 });
  } catch (error: any) {
    console.error("Error remixing app:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
