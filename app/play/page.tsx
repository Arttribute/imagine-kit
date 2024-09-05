"use client";
import { useState, useEffect } from "react";
import SketchPad from "@/components/imaginekit/ui/sketchpad/SketchPad";
import TextOutput from "@/components/imaginekit/ui/textoutput/TextOutput";
import ImageTiles from "@/components/imaginekit/ui/imagetiles/ImageTiles";
import WordSelector from "@/components/imaginekit/ui/wordtiles/select/WordSelector";
import WordArranger from "@/components/imaginekit/ui/wordtiles/arrange/WordArranger";
import ChatInterface from "@/components/imaginekit/ui/chat/ChatInteface";
import FlipCard from "@/components/imaginekit/ui/flipcard/FlipCard";
import ImageDisplay from "@/components/imaginekit/ui/display/ImageDisplay";
import TextInput from "@/components/imaginekit/ui/textinput/TextInput";

export default function Play() {
  return (
    <div>
      <SketchPad onSubmit={(imageData) => console.log(imageData)} />
      <TextOutput text="Hello, world!" />
      <ImageTiles
        src="https://res.cloudinary.com/arttribute/image/upload/v1723823036/m25z496he3yykfk3elsz.jpg"
        numCols={3}
      />
      <WordSelector
        correctWords={["Hello", "world"]}
        incorrectWords={["this", "is", "a", "test"]}
      />
      <WordArranger
        correctWords={["Hello", "world", "this", "is", "a", "test"]}
        setIsCorrect={() => {}}
      />
      <ChatInterface />
      <TextInput
        fields={[
          { label: "First name", value: "" },
          { label: "Last name", value: "" },
        ]}
        onSubmit={(fields) => console.log(fields)}
      />
      <FlipCard
        backTitle="Back title"
        frontTitle="Front title"
        frontContentText="Front test with a lot of words again and again"
        backContentText="Back text with a lot of words again and again"
      />
      <ImageDisplay images={["https://github.com/shadcn.png"]} />
    </div>
  );
}
