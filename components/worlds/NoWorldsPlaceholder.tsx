import * as React from "react";
import { Button } from "@/components/ui/button";
import { BadgePlus } from "lucide-react";
import Link from "next/link";

export default function NoWorldsPlaceholder({
  isAccountOwner,
  isPublishTab,
}: {
  isAccountOwner?: boolean;
  isPublishTab?: boolean;
}) {
  return (
    <div className="border border-gray-400 shadow-2xl shadow-indigo-100 rounded-2xl bg-white  p-2 w-96">
      <div className="p-4 border  border-gray-300 rounded-xl">
        <div className="p-3 mb-4 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-semibold">Formless and Void </h1>
          <p className="text-gray-500 text-center">
            {isAccountOwner
              ? `You have not ${
                  isPublishTab ? "published" : "created"
                } any worlds yet.`
              : `No worlds created here yet. 🚧`}
          </p>
        </div>
        <div className="flex justify-center w-full">
          {isAccountOwner && (
            <Link href="/worlds/create" passHref>
              <button className="flex items-center border border-indigo-600 text-indigo-600 font-bold rounded-lg py-1 px-4 shadow-lg my-1">
                <BadgePlus className="w-5 h-5 mr-1" />
                Create World
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
