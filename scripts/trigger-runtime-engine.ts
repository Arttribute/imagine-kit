import { RuntimeEngine } from "@/components/RuntimeEngine";
import { find } from "lodash";

const runtimeEngine = new RuntimeEngine();

runtimeEngine.load(process.env.APP_ID).then(async () => {
  runtimeEngine.compile();
  find(runtimeEngine.nodes, { state: { node_id: "TextInput-2" } })?.setInputs([
    {
      story: "A story about a potato",
    },
  ]);
  await runtimeEngine.run();

  console.log(
    find(runtimeEngine.nodes, {
      state: { node_id: "TextOutput-5" },
    })?.outputs
  );
  console.log(
    find(runtimeEngine.nodes, {
      state: { node_id: "TextOutput-4" },
    })?.outputs
  );
});

// runtimeEngine.run()
