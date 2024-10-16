"use client";
import { useState, useEffect, use } from "react";
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
import Image from "next/image";
import { PencilIcon } from "lucide-react";
import { m } from "framer-motion";

export default function EditAccountDialog({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(user.profile_image);
  const [displayName, setDisplayName] = useState(
    user.display_name || user.fullname.split(" ")[0]
  );
  const [userName, setUserName] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [error, setError] = useState<string | null>(null);
  const [isModified, setIsModified] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernameChanged, setUsernameChanged] = useState(false);

  useEffect(() => {
    // Check if any fields are modified
    if (
      userName !== user.username ||
      bio !== user.bio ||
      profileImageUrl !== user.profile_image ||
      displayName !== user.display_name
    ) {
      setIsModified(true);
    } else {
      setIsModified(false);
    }

    // Check if username is taken when it's modified
    if (userName !== user.username) {
      setUsernameChanged(true);
      checkUsernameAvailability(userName);
    } else {
      setUsernameChanged(false);
    }
  }, [
    userName,
    bio,
    profileImageUrl,
    user.username,
    user.bio,
    user.profile_image,
    displayName,
  ]);

  const checkUsernameAvailability = async (newUsername: string) => {
    try {
      const response = await axios.get(
        `/api/users/checkusername?username=${newUsername}`
      );
      if (response.data.isInvalid) {
        setUsernameError(response.data.errorMessage);
      } else {
        setUsernameError(null);
      }
    } catch (error) {
      console.error("Error checking username availability", error);
    }
  };

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "studio-upload");

    setLoading(true);
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/arttribute/upload",
      data
    );
    const uploadedFile = res.data;
    setProfileImageUrl(uploadedFile.secure_url); // Set the uploaded image URL
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (usernameError) return; // Prevent form submission if username is taken
    setLoading(true);
    setError(null);
    setIsSaved(false);

    try {
      const response = await axios.put(`/api/users/user?id=${user._id}`, {
        detailsToUpdate: {
          username: userName,
          display_name: displayName,
          bio,
          profile_image: profileImageUrl,
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to update user profile");
      }

      setIsSaved(true);
      setIsModified(false);
    } catch (error: any) {
      console.error("Failed to update user profile", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-gray-500 mt-2 mb-2 w-full">
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
        <div className="flex items-center gap-2">
          <div className="w-24">
            <input
              type="file"
              name="file"
              id="file"
              className="hidden"
              onChange={handleUpload}
            />

            <label htmlFor="file" className="cursor-pointer w-full">
              <Image
                src={profileImageUrl}
                width={100}
                height={100}
                alt={userName}
                className="border aspect-[1] object-cover rounded-full w-28"
              />
              <div className="flex items-center justify-center p-2 bg-white border border-gray-300 rounded-full w-8 -mt-10 ml-auto mx-2">
                <PencilIcon className="w-4 h-4 text-gray-700 " />
              </div>
            </label>
          </div>
          <div className="flex flex-col w-full ml-2">
            <Label className="mb-1">Username</Label>
            <Input
              placeholder="Enter your username"
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
            />
            {usernameError && (
              <p className="text-red-500 mt-1 text-xs">{usernameError}</p>
            )}
            {usernameChanged && !usernameError && (
              <p className="text-amber-500 mt-1 text-xs">
                Warning: Changing your username will break any links to your
                creations and profile page.
              </p>
            )}
          </div>
        </div>

        <Label className="mt-2">Display Name</Label>
        <Input
          placeholder="Enter your display name"
          onChange={(e) => setDisplayName(e.target.value)}
          value={displayName}
          className="-mt-2"
          autoFocus
        />

        <Label className="mt-2">Bio</Label>
        <Textarea
          className="w-full h-32 -mt-2"
          placeholder="Share something about yourself"
          onChange={(e) => setBio(e.target.value)}
          value={bio}
        />

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <DialogFooter>
          {!loading && (
            <Button
              onClick={handleSubmit}
              disabled={!isModified || !userName || usernameError !== null}
              className="w-full mt-2 bg-indigo-500 hover:bg-indigo-600"
            >
              {isSaved ? "Saved" : "Save Changes"}
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
