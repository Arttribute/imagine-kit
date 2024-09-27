"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface TriggerButtonProps {
  buttonName: string;
  onClickButton: (message: string) => void; // Callback function
  loading?: boolean;
}

function TriggerButton({
  buttonName,
  onClickButton,
  loading,
}: TriggerButtonProps) {
  const handleSubmit = () => {
    onClickButton("Trigger Execution button clicked!");
  };

  return (
    <div className="col-span-12 lg:col-span-10 w-96">
      {loading ? (
        <Button className="w-full" onClick={handleSubmit} disabled>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          {buttonName}
        </Button>
      ) : (
        <Button className="w-full" onClick={handleSubmit}>
          {buttonName}
        </Button>
      )}
    </div>
  );
}

export default TriggerButton;
