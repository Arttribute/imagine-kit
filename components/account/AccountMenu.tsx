"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CustomUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  username?: string | null;
}

interface CustomSession {
  user?: CustomUser;
}

function AccountMenu() {
  const { data: session, status } = useSession() as {
    data: CustomSession;
    status: string;
  };
  const [userAccount, setUserAccount] = useState<CustomUser | undefined>(
    session?.user
  );

  const handleProfileClick = () => {
    if (typeof window !== "undefined") {
      window.location.href = `/${session?.user?.username}`;
    }
  };

  useEffect(() => {
    // Only redirect if the session is not loading and there is no session data
    if (status === "loading") return; // Do nothing while loading
    if (!session) {
      setUserAccount(undefined);
    } else {
      setUserAccount(session?.user);
    }
  }, [session, status]);

  return (
    <>
      {userAccount && (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Image
                src={session?.user?.image || ""}
                alt={session?.user?.username || "user image"}
                width={32}
                height={32}
                className="rounded-full"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel onClick={handleProfileClick}>
                {session?.user?.username}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* Profile Button */}
              <DropdownMenuItem onClick={handleProfileClick}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* Logout Button */}
              <DropdownMenuItem
                onClick={() => {
                  signOut();
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      {!userAccount && status !== "loading" && (
        <button
          onClick={() => {
            if (typeof window !== "undefined") {
              window.location.href = "/signin";
            }
          }}
          className="flex items-center justify-center h-8 px-4 text-sm font-medium text-white bg-indigo-600 rounded-md"
        >
          Sign in
        </button>
      )}
    </>
  );
}

export default AccountMenu;
