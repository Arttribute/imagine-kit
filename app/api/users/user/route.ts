import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  try {
    await dbConnect();
    const user = await User.findOne({ username }).sort({
      createdAt: -1,
    });
    return new NextResponse(JSON.stringify(user), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse(error.message, {
      status: 500,
    });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  try {
    await dbConnect();
    const { detailsToUpdate } = await request.json();

    const updatedUser = await User.findByIdAndUpdate(id, detailsToUpdate, {
      new: true,
    });
    return new NextResponse(JSON.stringify(updatedUser), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse(error.message, {
      status: 500,
    });
  }
}
