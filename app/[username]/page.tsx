"use client";

import React, { useEffect, useState } from "react";
import UserDetails from "@/components/account/UserDetails";
import WorldCard from "@/components/worlds/WorldCard";
import AppBar from "@/components/layout/AppBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { BadgePlus, Earth } from "lucide-react";
import NoWorldsPlaceholder from "@/components/worlds/NoWorldsPlaceholder";

interface CustomUser {
  username?: string | null;
}

interface CustomSession {
  user?: CustomUser;
}

export default function Profile({ params }: { params: { username: string } }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [publishedWorlds, setPublishedWorlds] = useState<any[]>([]);
  const [userWorlds, setUserWorlds] = useState<any[]>([]);
  const { data: session, status } = useSession() as {
    data: CustomSession;
    status: string;
  };

  const isAccountOwner = session?.user?.username === params.username; // Check if logged-in user is the account owner

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const response = await fetch(
        `/api/users/user?username=${params.username}`
      );
      const data = await response.json();
      setUser(data.user);
      setUserWorlds(data.userApps);
      setPublishedWorlds(data.userApps.filter((app: any) => app.is_published));
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch user data", error);
      setLoading(false);
    }
  };

  return (
    <div>
      <AppBar />
      {loading && (
        <div className="mt-16">
          <p>Loading...</p>
        </div>
      )}
      {!loading && (
        <div className="container grid grid-cols-12 gap-4 px-12 mt-16">
          <div className="col-span-3">
            {user && <UserDetails user={user} />}
          </div>
          <div className="col-span-9 border rounded-xl p-2">
            <Tabs
              defaultValue={
                isAccountOwner ? "created-worlds" : "published-worlds"
              }
              className="h-full space-3-6"
            >
              <div className="flex">
                <div className="space-between flex items-center">
                  <Link href="/worlds">
                    <Button
                      variant="outline"
                      className="items-center rounded-lg mr-2"
                    >
                      <Earth className="h-5 w-5 text-indigo-500" />
                    </Button>
                  </Link>
                  <TabsList className="border border-gray-400">
                    {isAccountOwner && (
                      <TabsTrigger value="created-worlds">
                        Created Worlds
                      </TabsTrigger>
                    )}
                    <TabsTrigger value="published-worlds">
                      Published Worlds
                    </TabsTrigger>
                  </TabsList>
                </div>
                <div className="ml-auto">
                  {/* Only show the Create World button if the user is the account owner */}
                  {isAccountOwner && (
                    <Link href="/worlds/create" passHref>
                      <Button className="bg-indigo-600 hover:bg-indigo-500">
                        <BadgePlus className="w-5 h-5 mr-1" />
                        Create new world
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
              {isAccountOwner && (
                <TabsContent value="created-worlds">
                  <ScrollArea className="h-[80vh] overflow-scroll p-2">
                    <div className="grid grid-cols-12 gap-4 p-2">
                      {userWorlds &&
                        userWorlds.length > 0 &&
                        userWorlds.map((world) => (
                          <div
                            className="col-span-12 lg:col-span-4 "
                            key={world._id}
                          >
                            <WorldCard key={world._id} app={world} />
                          </div>
                        ))}
                      {userWorlds.length === 0 && (
                        <div className="col-span-12 h-[70vh]">
                          <div className=" h-full flex flex-col items-center justify-center">
                            <NoWorldsPlaceholder
                              isAccountOwner={isAccountOwner}
                              isPublishTab={false}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              )}
              <TabsContent value="published-worlds">
                <ScrollArea className="h-[80vh] overflow-scroll p-2">
                  <div className="grid grid-cols-12 gap-4 p-2">
                    {publishedWorlds &&
                      publishedWorlds.length > 0 &&
                      publishedWorlds.map((world) => (
                        <div
                          className="col-span-12 lg:col-span-4 "
                          key={world._id}
                        >
                          <WorldCard key={world._id} app={world} />
                        </div>
                      ))}
                    {publishedWorlds.length === 0 && (
                      <div className="col-span-12 h-[70vh]">
                        <div className=" h-full flex flex-col items-center justify-center">
                          <NoWorldsPlaceholder
                            isAccountOwner={isAccountOwner}
                            isPublishTab={true}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}
