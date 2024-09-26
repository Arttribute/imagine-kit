"use client";

import React, { useEffect, useState } from "react";
import UserDetails from "@/components/account/UserDetails";
import WorldCard from "@/components/worlds/WorldCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react"; // Assuming next-auth for session handling

interface CustomUser {
  username?: string | null;
}

interface CustomSession {
  user?: CustomUser;
}

export default function Profile({ params }: { params: { username: string } }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
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
      setUser(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch user data", error);
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {!loading && (
        <div className="container grid grid-cols-12 gap-4 px-12 mt-12">
          <div className="col-span-3">
            {user && <UserDetails user={user} />}
          </div>
          <div className="col-span-9 border rounded-xl p-2">
            <Tabs defaultValue="account" className="h-full space-y-6">
              <div className="flex">
                <div className="space-between flex items-center">
                  <TabsList>
                    <TabsTrigger value="account">Published</TabsTrigger>
                    {isAccountOwner && (
                      <TabsTrigger value="password">Created Worlds</TabsTrigger>
                    )}
                    <TabsTrigger value="interactions">Interactions</TabsTrigger>
                  </TabsList>
                </div>
                <div className="ml-auto">
                  {/* Only show the Create World button if the user is the account owner */}
                  {isAccountOwner && (
                    <Link href="/worlds/create" passHref>
                      <Button className="bg-indigo-500 hover:bg-indigo-600">
                        Create new world
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
              <TabsContent value="account">
                {/* Allow making changes to the account only if the user is the owner */}
                {isAccountOwner ? (
                  <p>Make changes to your account here.</p>
                ) : (
                  <p>Published worlds are visible here.</p>
                )}
              </TabsContent>
              <TabsContent value="password">
                {/* Restrict access to password changes to the account owner */}
                {isAccountOwner ? (
                  <p>Change your password here.</p>
                ) : (
                  <p>You do not have permission to view this section.</p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}
