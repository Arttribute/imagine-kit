"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface TextInputProps {
  fields: Array<{
    label: string;
    value: string;
  }>;
  onSubmit: (fields: Array<{ label: string; value: string }>) => void; // Callback function
  loading?: boolean;
}

function TextInput({ fields, onSubmit, loading }: TextInputProps) {
  const [inputFields, setInputFields] = useState(fields);

  const handleSubmit = () => {
    // Trigger the callback with the current input field values
    console.log("Inputs", inputFields);
    onSubmit(inputFields);
    // Clear the input fields after submission
    setInputFields(fields);
  };

  const handleInputChange = (index: number, value: string) => {
    setInputFields((prevFields) =>
      prevFields.map((field, i) => (i === index ? { ...field, value } : field))
    );
  };

  return (
    <div className="col-span-12 lg:col-span-10 w-96">
      {inputFields &&
        inputFields.map((field, index) => (
          <div key={index} className="flex flex-col w-full m-2">
            <Label>{field.label}</Label>
            <Input
              placeholder={field.label}
              className="mt-1"
              value={field.value}
              onChange={(e) => handleInputChange(index, e.target.value)}
            />
          </div>
        ))}
      <div className="flex flex-col w-full m-2">
        {loading ? (
          <Button className="w-full" onClick={handleSubmit} disabled>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Submit
          </Button>
        ) : (
          <Button className="w-full" onClick={handleSubmit}>
            Submit
          </Button>
        )}
      </div>
    </div>
  );
}

export default TextInput;
