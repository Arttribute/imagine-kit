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
import { Textarea } from "@/components/ui/textarea";
import TypingAnimation from "@/components/magicui/typing-animation";
import { Sparkles } from "lucide-react";
import { useState } from "react";

export default function GodPromptDialog({
  loading,
  setCreatePrompt,
  handleSubmit,
}: {
  loading: boolean;
  setCreatePrompt: any;
  handleSubmit: any;
}) {
  const [prompt, setPrompt] = useState("");

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    setCreatePrompt(e.target.value); // Update parent state with the new prompt
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center border rounded-lg p-2">
          <div className="w-[500px]">
            <TypingAnimation
              className="text-sm font-light text-gray-500"
              text="Let there be light..."
            />
          </div>
          <button className="flex border rounded-md text-xs w-[300px] p-1 px-2">
            <p className="text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Generate with AI
            </p>
            <Sparkles className="mt-1 ml-1 h-3 w-3 text-purple-500" />
          </button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Speak your app to life</DialogTitle>
          <DialogDescription>
            Describe in detail what you want to create
          </DialogDescription>
        </DialogHeader>
        <Textarea
          className="w-full h-40"
          placeholder="Describe your world"
          value={prompt}
          onChange={handlePromptChange}
        />
        <DialogFooter>
          {!loading && (
            <Button
              onClick={handleSubmit}
              className="w-full mt-2 bg-indigo-500 hover:bg-indigo-600"
              disabled={!prompt} // Disable the button if prompt is empty
            >
              Create World
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
