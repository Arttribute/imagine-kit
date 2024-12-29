"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { find, forEach, map } from "lodash";
import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

function TextOutput({ node, form }: { node: any; form: UseFormReturn }) {
  useEffect(() => {
    node?.addEventListener("outputs_change", () => {
      node.outputs?.forEach((output) => {
        forEach(output, (value, key) => {
          const inputId = find(node.state.data.inputs, { label: key })?.id;
          form.setValue(`${node.state.node_id}.${inputId}`, value);
        });
      });
    });
  }, [node]);

  return (
    <div className="w-96 ">
      <div className="text-sm text-center text-white bg-indigo-500 rounded-xl p-4 w-full">
        {node?.state?.data?.inputs?.map((field) => (
          <FormField
            key={`${node.state.node_id}.${field.id}`}
            control={form.control}
            name={`${node.state.node_id}.${field.id}`}
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>{field.label}</FormLabel> */}
                <FormControl>
                  <div>{!form.formState.isSubmitting && field.value}</div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        {form.formState.isSubmitting && (
          <div className="flex justify-center items-center h-full">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-50 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-purple-50 rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TextOutput;
