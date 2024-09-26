"use client";
import React, { useState, useEffect } from "react";
import WorldsList from "@/components/worlds/WorldsList";
import Link from "next/link";
import AccountMenu from "@/components/account/AccountMenu";
import { Sparkles, BadgePlus } from "lucide-react";

export default function Worlds() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApps();
  }, []);

  const getApps = async () => {
    const response = await fetch("/api/apps/published");
    const data = await response.json();
    setApps(data);
    setLoading(false);
  };

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 bg-white z-10">
        <div className="flex items-center my-2 mx-4">
          <div className="mx-5">
            <Link href="/">
              <div className="flex">
                <p className="p-1 whitespace-pre-wrap bg-gradient-to-r from-orange-500 via-pink-500 to-indigo-500 bg-clip-text text-center text-xl font-bold leading-none tracking-tighter text-transparent">
                  Imagine kit
                </p>
                <Sparkles className="h-4 w-4 mt-0.5 text-indigo-500" />
              </div>
            </Link>
          </div>
          <div className="grow" />
          <div className="mx-2">
            <Link href="/worlds/create" passHref>
              <button className="flex items-center border border-indigo-600 text-indigo-600 font-bold rounded-xl py-1 px-4 shadow-lg my-1">
                <BadgePlus className="w-5 h-5 mr-1" />
                Create World
              </button>
            </Link>
          </div>
          <div className="mx-2">
            <AccountMenu />
          </div>
        </div>
      </div>

      <div className="h-screen bg-slate-100">
        <div className="mt-16 pt-10 lg:p-10 bg-slate-100">
          {loading && (
            <div className="h-[100%] flex items-center justify-center">
              <p>Loading...</p>
            </div>
          )}
          {apps && <WorldsList apps={apps} />}
        </div>
      </div>
    </div>
  );
}
