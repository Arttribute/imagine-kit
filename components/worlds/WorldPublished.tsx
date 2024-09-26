import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import FlickeringGrid from "@/components/magicui/flickering-grid";
import Image from "next/image";
import Link from "next/link";
import Confetti from "@/components/magicui/confetti";
import RetroGrid from "@/components/magicui/retro-grid";

import type { ConfettiRef } from "@/components/magicui/confetti";

import { CopyIcon } from "lucide-react";

export default function WorldPublished({
  open,
  appData,
}: {
  open: boolean;
  appData: any;
}) {
  const confettiRef = useRef<ConfettiRef>(null);
  return (
    <Drawer open={open} onClose={() => {}}>
      <DrawerContent>
        <div className=" h-screen flex flex-col items-center justify-center p-8">
          <div className=" mb-2 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-semibold">Published</h1>
            <p className="text-sm  text-gray-500 ">
              Congratulations, your world is now live!
            </p>
          </div>
          <div className="z-10">
            <div className="p-6 mb-4 flex flex-col items-center justify-center">
              <div className="flex items-center justify-center w-72 mb-4">
                <Image
                  src={appData.worldImageUrl}
                  width={400}
                  height={400}
                  alt={"app"}
                  className="border aspect-[1/1] w-full h-auto object-cover rounded-t-2xl rounded-b-xl shadow-lg shadow-purple-200"
                />
              </div>
              <h1 className="text-2xl font-semibold mb-8">{appData.name}</h1>
              <div className="flex items-center justify-center w-96">
                <div className="flex items-center justify-center border border-indigo-300 shadow-purple-200 rounded-full">
                  <input
                    type="text"
                    value={`https://imaginekit.io/${appData?.owner}/worlds/${appData._id}`}
                    className="text-xs w-full px-4 py-1 bg-transparent"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `https://imaginekit.io/${appData?.owner}/worlds/${appData._id}`
                      );
                    }}
                    className="p-2 bg-indigo-500 text-white rounded-full m-1"
                  >
                    <CopyIcon className="w-4 h-4" />
                  </button>
                </div>

                <Link href={`/${appData?.owner}/worlds/${appData._id}`}>
                  <Button className="ml-4 bg-indigo-500 hover:bg-indigo-600 rounded-xl">
                    View
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex justify-center p-4 w-full">
              <Link href={`/${appData?.owner}/worlds/${appData._id}/edit`}>
                <Button variant="outline" className="w-full rounded-xl">
                  Edit World
                </Button>
              </Link>
            </div>
          </div>
          <Confetti
            ref={confettiRef}
            className="z-10 absolute left-0 top-0 z-0 size-full"
            onMouseEnter={() => {
              confettiRef.current?.fire({});
            }}
          />
          <RetroGrid />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
