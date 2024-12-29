"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

interface TextInputProps {
  node: any;
  form: UseFormReturn;
}

function TextInput({ node, form }: TextInputProps) {
  return (
    <div className="col-span-12 lg:col-span-10 w-96">
      {node?.state?.data?.outputs?.map((field) => (
        <FormField
          key={`${node.state.node_id}.${field.id}`}
          control={form.control}
          name={`${node.state.node_id}.${field.id}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <Input placeholder={field.label} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
      <div className="flex flex-col w-full m-2">
        <Button
          className="w-full"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          )}
          Submit
        </Button>
      </div>
    </div>
  );
}

export default TextInput;
