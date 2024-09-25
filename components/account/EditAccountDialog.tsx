"use client";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
//import { toast } from "react-toastify"; // Assuming you're using a toast notification library

export default function EditAccountDialog({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(`/api/users/user?id=${user._id}`, {
        detailsToUpdate: { username: userName, bio },
      });

      if (response.status !== 200) {
        throw new Error("Failed to update user profile");
      }

      //toast.success("Profile updated successfully!"); // Display a success message
    } catch (error: any) {
      console.error("Failed to update user profile", error);
      setError(error.message);
      //toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-2 mb-2 w-full">
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            {"Make changes to your profile here. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>

        <Label>Username</Label>
        <Input
          placeholder="Enter your username"
          onChange={(e) => setUserName(e.target.value)}
          value={userName}
        />
        <Label className="mt-4">Bio</Label>
        <Textarea
          className="w-full h-40 mt-2"
          placeholder="Share something about yourself"
          onChange={(e) => setBio(e.target.value)}
          value={bio}
        />

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <DialogFooter>
          {!loading && (
            <Button
              onClick={handleSubmit}
              className="w-full mt-2 bg-indigo-500 hover:bg-indigo-600"
            >
              Save Changes
            </Button>
          )}
          {loading && (
            <Button disabled className="w-full mt-2 bg-indigo-500">
              Loading...
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
