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
    let isInvalid = false;
    let errorMessage = "";
    const user = await User.findOne({ username });

    // Check if the username exists in the database
    if (user) {
      isInvalid = true;
      errorMessage = "Username is already taken";
    }

    //Username should not contain spaces
    if (username.includes(" ")) {
      isInvalid = true;
      errorMessage = "Username should not contain spaces";
    }

    //Username should not contain capital letters
    if (username !== username.toLowerCase()) {
      isInvalid = true;
      errorMessage = "Username should be lowercase";
    }

    //Username should not contain special characters except for underscore
    if (!/^[a-zA-Z0-9_]*$/.test(username)) {
      isInvalid = true;
      errorMessage = "Username should not contain special characters";
    }

    //Username should not be less than 3 characters
    if (username.length < 3) {
      isInvalid = true;
      errorMessage = "Username should be at least 3 characters";
    }

    return new NextResponse(JSON.stringify({ isInvalid, errorMessage }), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
