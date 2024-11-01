"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  EarthIcon,
  LockIcon,
  BookOpenIcon,
  PencilIcon,
  Pen,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import WorldPublished from "./WorldPublished";
import axios from "axios";
import { set } from "lodash";

interface appData {
  _id: string;
  name: string;
  owner: {
    username: string;
  };
  description: string;
  banner_url: string;
  is_private: boolean;
  is_published: boolean;
}

export default function EditWorldMetadata({ appData }: { appData: appData }) {
  const [appId, setAppId] = useState(appData?._id);
  const [owner, setOwner] = useState(appData?.owner.username);
  const [isPublished, setIsPublished] = useState(appData?.is_published);
  const [openPublishedDrawer, setOpenPublishedDrawer] = useState(false);
  const [open, setOpen] = useState(false);
  const [isPrivate, setIsPrivate] = useState(appData?.is_private);
  const [name, setName] = useState(appData?.name);
  const [worldImageUrl, setWorldImageUrl] = useState(
    appData?.banner_url ||
      "https://res.cloudinary.com/arttribute/image/upload/v1723823036/m25z496he3yykfk3elsz.jpg"
  );
  const [description, setDescription] = useState(appData?.description);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAppId(appData?._id);
    setOwner(appData?.owner.username);
    setIsPublished(appData?.is_published);
    setIsPrivate(appData?.is_private);
    setName(appData?.name);
    setWorldImageUrl(appData?.banner_url);
    setDescription(appData?.description);
  }, [appData]);

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
    setWorldImageUrl(uploadedFile.secure_url); // Set the uploaded image URL
    setLoading(false);
  };

  const handlePublish = async () => {
    setLoading(true);
    setError(null);

    if (!name) {
      setError("Please enter a name for your world");
      setLoading(false);
      return;
    }

    try {
      // Make an API request to publish the world
      await axios.put(`/api/apps/app?appId=${appData._id}`, {
        detailsToUpdate: {
          name,
          description,
          is_private: isPrivate,
          is_published: true,
          banner_url: worldImageUrl,
        },
      });

      //toast.success("World published successfully!"); // Display a success message
      setIsPublished(true);
      setOpen(false);
      setOpenPublishedDrawer(true);
    } catch (error: any) {
      console.error("Failed to publish world", error);
      setError(error.message);
      //toast.error("Failed to publish world. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnpublish = async () => {
    setLoading(true);
    setError(null);

    try {
      // Make an API request to unpublish the world
      await axios.put(`/api/apps/app?appId=${appData._id}`, {
        detailsToUpdate: {
          name,
          description,
          is_private: isPrivate,
          is_published: false,
          banner_url: worldImageUrl,
        },
      });

      //toast.success("World unpublished successfully!"); // Display a success message
      setIsPublished(false);
    } catch (error: any) {
      console.error("Failed to unpublish world", error);
      setError(error.message);
      //toast.error("Failed to unpublish world. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="flex items-center justify-center border border-indigo-200 shadow-lg bg-white shadow-purple-200 rounded-full p-1">
            <EarthIcon className="w-6 h-6 text-indigo-500 m-1" />
            <div className="p-1  truncate w-36 ">
              <p className="text-sm text-gray-800 font-semibold text-ellipsis overflow-hidden ">
                {name}
              </p>
            </div>
            <div className="py-2 px-4 bg-indigo-500 rounded-full text-xs text-white ">
              {isPublished ? "Published" : "Publish World"}
            </div>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{name}</DialogTitle>
            <DialogDescription>
              Make your world visible to others by publishing it.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 lg:col-span-6">
              <input
                type="file"
                name="file"
                id="file"
                className="hidden"
                onChange={handleUpload}
              />

              <label htmlFor="file" className="cursor-pointer w-full">
                <Image
                  src={worldImageUrl}
                  width={400}
                  height={400}
                  alt={"app"}
                  className="border aspect-[2/1] lg:aspect-[1/1] w-full h-auto object-cover rounded-t-2xl rounded-b-xl"
                />
                <div className="flex items-center justify-center p-2 bg-white z-10 border border-gray-300 rounded-full w-8 -mt-10 ml-auto mx-2">
                  <PencilIcon className="w-4 h-4 text-gray-700 " />
                </div>
              </label>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <Label>World Name</Label>
              <Input
                value={name}
                placeholder="World Name"
                className="mt-1"
                onChange={(e) => setName(e.target.value)}
              />
              <Label className="mt-4">Description</Label>
              <Textarea
                className="w-full h-20 mt-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="flex items-center mt-4">
                <RadioGroup
                  defaultValue={isPrivate ? "true" : "false"}
                  onValueChange={(value) => setIsPrivate(value === "true")}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" />
                    <BookOpenIcon className="w-6 h-6 text-gray-700" />
                    <div className="flex flex-col">
                      <p className="text-xs text-gray-700 font-semibold">
                        Public
                      </p>
                      <p className="text-xs text-gray-500">
                        Anyone can interact with this world
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" />
                    <LockIcon className="w-6 h-6 text-gray-700" />
                    <div className="flex flex-col">
                      <p className="text-xs text-gray-700 font-semibold">
                        Private
                      </p>
                      <p className="text-xs text-gray-500">
                        Choose who interacts with this world
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
          <DialogFooter>
            <div className="flex w-full">
              <Button type="submit" className="w-full" onClick={handlePublish}>
                {isPublished ? "Save and Publish World" : "Publish World"}
              </Button>
              {isPublished && (
                <Button
                  variant="outline"
                  type="submit"
                  className="text-red-500 w-72 ml-2 border-red-500"
                  onClick={handleUnpublish}
                >
                  Unpublish World
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <WorldPublished
        open={openPublishedDrawer}
        setOpen={setOpenPublishedDrawer}
        appData={{
          appId,
          name,
          owner,
          description,
          worldImageUrl,
          isPrivate,
          isPublished,
        }}
      />
    </div>
  );
}
