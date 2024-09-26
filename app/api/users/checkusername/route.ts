import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return new NextResponse(
      JSON.stringify({ error: "Username not provided" }),
      {
        status: 400,
      }
    );
  }

  try {
    await dbConnect();
    const user = await User.findOne({ username });

    // Check if the username exists in the database
    const isTaken = !!user;

    return new NextResponse(JSON.stringify({ isTaken }), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
