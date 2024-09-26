import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

import { HeartIcon, PlayIcon, PointerIcon, PencilIcon } from "lucide-react";

interface CustomUser {
  username?: string | null;
}

interface CustomSession {
  user?: CustomUser;
}

export default function WorldCard({ app }: { app: any }) {
  const { data: session, status } = useSession() as {
    data: CustomSession;
    status: string;
  };

  const isAccountOwner = session?.user?.username === app.owner.username;

  const pathname = usePathname();
  const isProfile = pathname === `/${app.owner.username}`;
  return (
    <div className="cursor-pointer border border-indigo-400 bg-white shadow-md rounded-3xl">
      <Link href={`/${app.owner.username}/worlds/${app._id}`}>
        <div className="p-2 pb-0">
          <Image
            src={
              app.banner_url ||
              "https://res.cloudinary.com/arttribute/image/upload/v1723823036/m25z496he3yykfk3elsz.jpg"
            }
            width={400}
            height={400}
            alt={"app"}
            className="aspect-[5/4] w-full h-auto object-cover rounded-t-2xl rounded-b-xl border border-gray-400"
          />
          <div className="flex flex-col mt-4 ml-2">
            <Label className="font-semibold text-lg">{app.name}</Label>
          </div>
        </div>
      </Link>

      <div className="flex flex-col ml-2 mb-3 p-2 pt-0">
        <div className="flex items-center mt-1 mb-2">
          <Avatar className="w-6 h-6 mr-1">
            <AvatarImage src={app.owner?.profile_image} alt="@shadcn" />
            <AvatarFallback>@</AvatarFallback>
          </Avatar>
          <Label className="text-sm text-gray-500">
            {" "}
            by{" "}
            <Link href={`/${app.owner.username}`}>
              <span className="text-gray-700 font-semibold">
                {app.owner?.username}
              </span>
            </Link>
          </Label>
        </div>
        <div className="flex items-center">
          {isAccountOwner && isProfile && (
            <Link href={`/${app.owner.username}/worlds/${app._id}/edit`}>
              <div className="flex items-center ml-1 mr-3">
                <PencilIcon className="w-4 h-4 mr-1 text-gray-500" />
              </div>
            </Link>
          )}
          {/* <div className="flex items-center ml-1 mr-3">
            <HeartIcon className="w-4 h-4 mr-1 text-gray-500" />
            <Label className="text-sm text-gray-500">
              {app.likes_count || 0}
            </Label>
          </div>
          <div className="flex items-center">
            <PointerIcon className="w-4 h-4 mr-1 text-gray-500" />
            <Label className="text-sm text-gray-500">
              {app.likes_count || 0}
            </Label>
          </div>
          */}
        </div>
      </div>
    </div>
  );
}
