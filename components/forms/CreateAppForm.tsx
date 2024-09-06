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
      router.push(`/worlds/edit/${appId}`);
    } catch (error) {
      setError((error as any).response.data.message);
    }

    setLoading(false);
  };

  return (
    <div className="w-96 m-auto">
      <Label>Name</Label>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter the name of the app"
      />
      <Label>Description</Label>
      <Input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter the description of the app"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!loading && <Button onClick={handleSubmit}>Create App</Button>}
      {loading && <Button disabled>Loading...</Button>}
    </div>
  );
};

export default CreateAppForm;
