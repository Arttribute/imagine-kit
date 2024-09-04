// app/api/uicomponents/route.ts
import dbConnect from "@/lib/dbConnect";
import UIComponent from "@/models/UIComponent";
import { NextResponse } from "next/server";

/**
 * GET /api/uicomponents - Get all UI components
 */
export async function GET() {
  try {
    await dbConnect();
    const uiComponents = await UIComponent.find().sort({ createdAt: -1 });
    return NextResponse.json(uiComponents, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching UI components:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/uicomponents - Create a new UI component
 */
export async function POST(request: Request) {
  try {
    await dbConnect();
    const { uiComponents } = await request.json(); // Destructure uiComponents array from request

    if (!uiComponents || !Array.isArray(uiComponents)) {
      return new NextResponse("Invalid UI components data", { status: 400 });
    }

    const savedComponents = await Promise.all(
      uiComponents.map(async (component) => {
        const { component_id, type, label, position, app_id } = component;

        return UIComponent.findOneAndUpdate(
          { component_id, app_id },
          { component_id, type, label, position, app_id }, // Include type and label
          { upsert: true, new: true, runValidators: true }
        );
      })
    );

    return new NextResponse(JSON.stringify(savedComponents), { status: 200 });
  } catch (error: any) {
    console.error("Error creating UI component:", error.message);
    return new NextResponse(error.message, { status: 500 });
  }
}

/**
 * DELETE /api/uicomponents/:id - Delete a UI component by ID
 */
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "UI Component ID is required" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const deletedUIComponent = await UIComponent.findByIdAndDelete(id);

    if (!deletedUIComponent) {
      return NextResponse.json(
        { error: "UI Component not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "UI Component deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting UI component:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
