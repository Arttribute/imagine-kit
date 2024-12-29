"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect } from "react";
import { useRuntimeEngine } from "@/components/NewRuntimeEngineRenderer";

function TestPage() {
  const [form, engine, Renderer] = useRuntimeEngine(
    process.env.NEXT_PUBLIC_APP_ID
  );

  const onSubmit = useCallback(() => {
    engine?.run();

    engine.listen("TextOutput-4", "outputs_change", (node) => {
      console.log("Listening to TextOutput-4 - Changed");
      console.log(node);
      form.setValue("TextOutput-4.input-0", node.outputs[0]["translated"]);
    });
    engine.listen("TextOutput-5", "outputs_change", (node) => {
      console.log("Listening to TextOutput-5 - Changed");
      console.log(node);
      form.setValue("TextOutput-5.input-0", node.outputs[0]["story"]);
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      //   engine.listen("TextInput-2", "inputs_change", (node) => {
      //     form.setValue(
      //       "TextOutput-4.input-0",
      //       `Listening: ${node.inputs[0]["output-0"]}`
      //     );
      //   });
      //   form.setValue("TextOutput-4.input-0", "Test value");
      //   form.setValue("TextOutput-5.input-0", "Test value");
    }, 2000);
  }, []);

  return (
    <div>
      <h1>Test Page</h1>
      <div>
        <Renderer />
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onReset={() => form.reset()}
        >
          <FormField
            control={form.control}
            name="TextInput-2.output-0"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TextInput-2.output-0</FormLabel>
                <FormControl>
                  <Input placeholder="Test Input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="TextOutput-4.input-0"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TextOutput-4.input-0</FormLabel>
                <FormControl>
                  <div>{field.value}</div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="TextOutput-5.input-0"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TextOutput-5.input-0</FormLabel>
                <FormControl>
                  <div>{field.value}</div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}

export default TestPage;
