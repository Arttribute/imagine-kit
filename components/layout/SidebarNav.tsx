"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PanelLeft, BookOpen, PlusCircle, Sparkles, Earth } from "lucide-react";

function NavItem({
  icon: Icon,
  label,
  isOpen,
}: {
  icon: any;
  label: string;
  isOpen: boolean;
}) {
  return (
    <li>
      <Link
        href="#"
        className="flex items-center gap-3 text-muted-foreground hover:text-foreground py-2 px-2 rounded-md hover:bg-accent transition-colors"
      >
        <Icon className="h-5 w-5" />
        {isOpen && <span className="text-sm">{label}</span>}
      </Link>
    </li>
  );
}

export function SidebarNav({ username }: { username: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [recentChats, setRecentChats] = useState<any[]>([]);

  useEffect(() => {
    async function fetchRecentChats() {
      try {
        const res = await fetch(`/api/users/user?username=${username}`);
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await res.json();
        // data.appsByLastInteraction is already sorted newest -> oldest
        setRecentChats(data.appsByLastInteraction || []);
      } catch (error) {
        console.error(error);
      }
    }

    fetchRecentChats();
  }, [username]);

  return (
    <div
      className={cn(
        "h-screen bg-background border-r border-border flex flex-col transition-all duration-300",
        isOpen ? "w-[220px] min-w-[220px]" : "w-[60px] min-w-[60px]"
      )}
    >
      <div className="px-3 pt-4 flex items-center justify-between">
        {isOpen ? (
          <button
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
        ) : (
          <div className="px-2">
            <button
              onClick={() => setIsOpen(true)}
              className=" items-center justify-center text-muted-foreground hover:text-foreground"
            >
              <PanelLeft className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="flex items-center">
          {isOpen && (
            <Link href="/">
              <Sparkles className="h-4 w-4 -mt-0.5 text-indigo-500" />
            </Link>
          )}
        </div>
      </div>

      <div className="px-3 py-2">
        <button className="w-full flex items-center justify-center gap-2 bg-indigo-500 text-primary-foreground rounded-md py-2 font-medium text-sm">
          {isOpen ? (
            <>
              <PlusCircle className="h-4 w-4" />
              New World
            </>
          ) : (
            <PlusCircle className="h-5 w-5" />
          )}
        </button>
      </div>

      <nav className="mt-2 px-3">
        <ul className="space-y-1">
          <NavItem icon={Earth} label="All Worlds" isOpen={isOpen} />
          <NavItem icon={BookOpen} label="How to" isOpen={isOpen} />
        </ul>
      </nav>

      {isOpen && (
        <div className="mt-6 flex-1 overflow-y-auto">
          <div className="px-3">
            <h3 className="text-xs font-medium text-muted-foreground mb-2">
              Recent Builds
            </h3>
            <ul className="space-y-1">
              {recentChats.map((item) => {
                const { app, lastInteraction } = item;
                return (
                  <li key={app._id}>
                    <Link
                      href={`/${username}/worlds/${app._id}/edit`}
                      className="block text-sm py-1.5 px-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      {app.name}
                      {/* Optionally format lastInteraction date, e.g.: 
                         <span className="ml-2 text-xs text-muted-foreground">
                           {new Date(lastInteraction).toLocaleString()}
                         </span> 
                      */}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
