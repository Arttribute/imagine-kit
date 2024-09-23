import React from "react";
import { Button } from "@/components/ui/button";

interface TriggerButtonProps {
  buttonName?: string;
}

const TriggerButton: React.FC<TriggerButtonProps> = ({ buttonName }) => {
  return (
    <div className="flex flex-col w-96">
      {/* Static input description */}
      <Button className="mt-1">{buttonName || "Start"}</Button>
    </div>
  );
};

export default TriggerButton;
