"use client";
import SketchPad from "@/components/imaginekit/sketchpad/SketchPad";
import FlipCard from "@/components/imaginekit/flipcard/FlipCard";
import WordArranger from "@/components/imaginekit/wordtiles/arrange/WordArranger";
import ChatInteface from "@/components/imaginekit/chat/ChatInteface";

export default function Home() {
  const handleButtonClick = () => {
    console.log("Button clicked");
  };
  return (
    <div>
      <SketchPad />
      <FlipCard />
      <WordArranger
        correctWords={["This", "Is", "A", "Test"]}
        setIsCorrect={(isCorrect: any) => console.log("Is correct", isCorrect)}
      />
      <ChatInteface />
    </div>
  );
}
