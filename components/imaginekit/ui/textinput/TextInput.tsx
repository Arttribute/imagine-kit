"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TextInputProps {
  fields: Array<{
    label: string;
    value: string;
  }>;
  onSubmit: (fields: Array<{ label: string; value: string }>) => void; // Callback function
}

function TextInput({ fields, onSubmit }: TextInputProps) {
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
      {inputFields.map((field, index) => (
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
      <Button className="w-full m-2" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
}

export default TextInput;
