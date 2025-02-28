"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  PanelLeft,
  BookOpen,
  FolderKanban,
  MessageSquareHeart,
  PlusCircle,
  Sparkles,
  X,
} from "lucide-react";

// Sample data for recent projects
const recentProjects = [
  { id: 1, name: "Retro Grid Demo", path: "/retro-grid-demo" },
  { id: 2, name: "Landing page creation", path: "/landing-page-creation" },
  { id: 3, name: "Floating Agent Showcase", path: "/floating-agent-showcase" },
  { id: 4, name: "Modern ui design", path: "/modern-ui-design" },
  { id: 5, name: "login-01", path: "/login-01" },
  { id: 6, name: "UI landing page", path: "/ui-landing-page" },
  { id: 7, name: "Login screen", path: "/login-screen" },
];

export function SidebarNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={cn(
        "h-screen bg-background border-r border-border flex flex-col transition-all duration-300",
        isOpen ? "w-[220px] min-w-[220px]" : "w-[60px] min-w-[60px]"
      )}
    >
      <div className="px-3 pt-4 flex items-center justify-between">
        <div className="flex items-center">
          {isOpen && (
            <Link href="/">
              <Sparkles className="h-4 w-4 -mt-0.5 text-indigo-500" />
            </Link>
          )}
        </div>
        {isOpen && (
          <button
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
        )}
        {!isOpen && (
          <div className="px-2">
            <button
              onClick={() => setIsOpen(true)}
              className=" items-center justify-center  text-muted-foreground hover:text-foreground"
            >
              <PanelLeft className="h-5 w-5" />
            </button>
          </div>
        )}
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
          <NavItem icon={Sparkles} label="Community" isOpen={isOpen} />
          <NavItem icon={BookOpen} label="Library" isOpen={isOpen} />
          <NavItem icon={FolderKanban} label="Projects" isOpen={isOpen} />
          <NavItem icon={MessageSquareHeart} label="Feedback" isOpen={isOpen} />
        </ul>
      </nav>

      {isOpen && (
        <div className="mt-6 flex-1 overflow-y-auto">
          <div className="px-3">
            <h3 className="text-xs font-medium text-muted-foreground mb-2">
              Recent Chats
            </h3>
            <ul className="space-y-1">
              {recentProjects.map((project) => (
                <li key={project.id}>
                  <Link
                    href={project.path}
                    className="block text-sm py-1.5 px-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {project.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

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
