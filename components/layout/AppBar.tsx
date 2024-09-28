"use client";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { Sparkles } from "lucide-react";
import AccountMenu from "@/components/account/AccountMenu";
import Link from "next/link";
import BetaSticker from "@/components/layout/BetaSticker";

export default function AppBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-10 p-2 bg-white border-b">
      <Menubar className="rounded-none border-none px-2 lg:px-4">
        <MenubarMenu>
          <div className=" lg:hidden"></div>
          <MenubarTrigger>
            <Link href="/">
              <div className="flex">
                <p className="p-1 whitespace-pre-wrap bg-gradient-to-r from-orange-500 via-pink-500 to-indigo-500 bg-clip-text text-center text-xl font-bold leading-none tracking-tighter text-transparent">
                  Imagine kit
                </p>
                <Sparkles className="h-4 w-4 mt-0.5 text-indigo-500" />
              </div>
            </Link>
            <BetaSticker />
          </MenubarTrigger>
        </MenubarMenu>
        <div className="grow" />
        <div className="flex">
          <AccountMenu />
        </div>
      </Menubar>
    </div>
  );
}
