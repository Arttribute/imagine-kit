import * as React from "react";

import Link from "next/link";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Label } from "@/components/ui/label";

export default function WorldCard({ app }: { app: any }) {
  return (
    <Link href={`/${app.owner.name}/worlds/${app._id}`}>
      <div className="cursor-pointer border p-2 rounded-xl">
        <Image
          src={
            app.banner_url ||
            "https://res.cloudinary.com/arttribute/image/upload/v1723823036/m25z496he3yykfk3elsz.jpg"
          }
          width={400}
          height={400}
          alt={"app"}
          className="aspect-[5/4] w-full h-auto object-cover rounded-md "
        />

        <div className="flex  m-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={app.owner?.picture} alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col ml-2 mt-1">
            <Label className="font-semibold">{app.name}</Label>
            <Label className="text-xs text-gray-500">
              {" "}
              by {app.owner?.name}
            </Label>
          </div>
        </div>
      </div>
    </Link>
  );
}
