"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UsersIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import EditAccountDialog from "./EditAccountDialog";

interface CustomUser {
  username?: string | null;
}

interface CustomSession {
  user?: CustomUser;
}

const UserDetails = ({ user }: { user: any }) => {
  const { data: session, status } = useSession() as {
    data: CustomSession;
    status: string;
  };
  const isAccountOwner = session?.user?.username === user.username; // Check if the logged-in user owns the account

  return (
    <div className="flex flex-col">
      <Image
        src={
          user.profile_image ||
          "https://res.cloudinary.com/arttribute/image/upload/v1723823036/m25z496he3yykfk3elsz.jpg"
        }
        width={300}
        height={300}
        alt={"profile"}
        className="aspect-[1] rounded-full m-1"
      />
      <div className="flex flex-col mt-2">
        <h1 className="text-gray-900 text-xl font-semibold">
          {user.username || "@username"}
        </h1>

        {/* Conditionally render the "Edit Profile" button only if the logged-in user is the account owner */}
        {isAccountOwner && <EditAccountDialog user={user} />}

        <div className="flex items-center gap-2 underline mb-2">
          <UsersIcon className="h-4 w-4" />
          <p>{user.followercount} followers</p>
          <p className="ml-1 underline">{user.followingcount} following</p>
        </div>

        <p className="text-gray-500 w-full mb-2">
          {user.bio ||
            "Long bio with a lot of words that is going to be more than 2 lines of text"}
        </p>
      </div>
    </div>
  );
};

export default UserDetails;
