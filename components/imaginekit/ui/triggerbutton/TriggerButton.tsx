"use client";
import React from "react";
import { Button } from "@/components/ui/button";

interface TriggerButtonProps {
  buttonName: string;
  onClickButton: (message: string) => void; // Callback function
}

function TriggerButton({ buttonName, onClickButton }: TriggerButtonProps) {
  const handleSubmit = () => {
    onClickButton("Trigger Execution button clicked!");
  };

  return (
    <div className="col-span-12 lg:col-span-10 w-96">
      <Button className="w-full m-2" onClick={handleSubmit}>
        {buttonName}
      </Button>
    </div>
  );
}

export default TriggerButton;
