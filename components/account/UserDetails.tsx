"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { User2Icon, UsersIcon } from "lucide-react";

const UserDetails = ({ user }: { user: any }) => {
  return (
    <div className="flex flex-col">
      <Image
        src={
          user?.profile_image ||
          "https://res.cloudinary.com/arttribute/image/upload/v1723823036/m25z496he3yykfk3elsz.jpg"
        }
        width={300}
        height={300}
        alt={"game"}
        className="aspect-[1] rounded-full  m-1 "
      />
      <div className="flex flex-col mt-2">
        <h1 className="text-2xl font-semibold">
          {user?.name || "User full name"}
        </h1>
        <p className="text-gray-500">{user?.email || "@username"}</p>

        <Button variant="outline" className="mt-2 mb-2 w-full">
          Edit Profile
        </Button>
        <div className="flex items-center gap-2 underline mb-2">
          <UsersIcon className="h-4 w-4" />
          <p className="">{user?.follower_count || 0} followers</p>
          <p className=" ml-1 underline">
            {user?.following_count || 0} following
          </p>
        </div>
        <p className="text-gray-500 w-full mb-2">
          {user?.bio ||
            "Long bio with alot of words that is going to be more than 2 lines of text"}
        </p>
      </div>
    </div>
  );
};

export default UserDetails;
