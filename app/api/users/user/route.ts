// app/api/users/user/route.ts
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import App from "@/models/App";
import BuildChatInteraction from "@/models/BuildChatInteraction";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  try {
    await dbConnect();

    // Find the user by username
    const user = await User.findOne({ username }).sort({ createdAt: -1 });
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // (Optional) you can still retrieve all the user’s apps:
    const userApps = await App.find({ owner: user._id })
      .sort({ createdAt: -1 })
      .populate("owner");

    // 1) Aggregate the user’s BuildChatInteraction to find last usage per app
    const appsByLastInteraction = await BuildChatInteraction.aggregate([
      { $match: { owner: user._id } },
      {
        $group: {
          _id: "$app_id", // group by each distinct app
          lastInteraction: { $max: "$createdAt" }, // find the most recent chat
        },
      },
      { $sort: { lastInteraction: -1 } }, // sort descending by last interaction
      {
        $lookup: {
          from: "apps", // <--- The MongoDB collection name for "App" model is typically "apps"
          localField: "_id",
          foreignField: "_id",
          as: "app",
        },
      },
      { $unwind: "$app" }, // turn the [app] array into an object
      {
        $project: {
          _id: 0,
          lastInteraction: 1,
          "app._id": 1,
          "app.owner": 1,
          "app.name": 1,
          "app.description": 1,
          "app.banner_url": 1,
        },
      },
    ]);

    // Return both the user info and your new aggregator data
    return new NextResponse(
      JSON.stringify({
        user,
        userApps, // all user-owned apps (optional)
        appsByLastInteraction, // sorted by last usage
      }),
      { status: 200 }
    );
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
