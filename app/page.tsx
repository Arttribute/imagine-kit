import SketchPad from "@/components/imaginekit/sketchpad/SketchPad";
import FlipCard from "@/components/imaginekit/flipcard/FlipCard";
export default function Home() {
  const handleButtonClick = () => {
    console.log("Button clicked");
  };
  return (
    <div>
      <SketchPad />
      <FlipCard />
    </div>
  );
}
