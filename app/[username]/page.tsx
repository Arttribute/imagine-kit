"use client";
import React, { useEffect, useState } from "react";
import UserDetails from "@/components/account/UserDetails";
import WorldCard from "@/components/worlds/WorldCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Profile({ params }: { params: { username: string } }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

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
      console.error;
    }
  };
  return (
    <div>
      {loading && <p>Loading...</p>}
      <div className="container grid grid-cols-12 gap-4 px-12 mt-12">
        <div className="col-span-3">{user && <UserDetails user={user} />}</div>
        <div className="col-span-9 border rounded-xl p-2">
          <Tabs defaultValue="account" className="h-full space-y-6">
            <div className="flex ">
              <div className="space-between flex items-center">
                <TabsList>
                  <TabsTrigger value="account">Published</TabsTrigger>
                  <TabsTrigger value="password">Created Worlds</TabsTrigger>
                  <TabsTrigger value="interactions">Interactions</TabsTrigger>
                </TabsList>
              </div>
              <div className="ml-auto ">
                <Link href="/worlds/create" passHref>
                  <Button className="bg-indigo-500 hover:bg-indigo-600">
                    Create new world
                  </Button>
                </Link>
              </div>
            </div>
            <TabsContent value="account">
              Make changes to your account here.
            </TabsContent>
            <TabsContent value="password">
              Change your password here.
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
