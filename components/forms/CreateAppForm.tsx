"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

const CreateAppForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const appData = {
        owner: "66d82dbacd3e15b1bd2fbc27",
        name,
        description,
      };
      const response = await axios.post("/api/apps", appData);
      console.log("Response", response.data);
      const appId = response.data._id;
      router.push(`/${"username"}/worlds/${appId}/edit`);
      setLoading(false);
    } catch (error) {
      setError((error as any).response.data.message);
    }
  };

  return (
    <div className="border border-gray-500 shadow-2xl shadow-indigo-200 rounded-2xl bg-white z-10 p-2 w-96 lg:w-[460px]">
      <div className="p-6 border  border-gray-300 rounded-xl">
        <div className="p-6 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-semibold">Create new world</h1>
          <p className="text-gray-500">
            Build your unique interactive experience
          </p>
        </div>

        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name your world"
        />

        {!loading && (
          <Button
            onClick={handleSubmit}
            className="w-full mt-2  bg-indigo-500 hover:bg-indigo-600"
          >
            Create World
          </Button>
        )}
        {loading && (
          <Button disabled className="w-full mt-2  bg-indigo-500">
            Loading...
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreateAppForm;
