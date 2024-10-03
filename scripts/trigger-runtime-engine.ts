import { RuntimeEngine } from "@/components/RuntimeEngine";
import { find } from "lodash";

const runtimeEngine = new RuntimeEngine();

runtimeEngine.load(process.env.APP_ID).then(async () => {
  runtimeEngine.compile();
  find(runtimeEngine.nodes, { state: { node_id: "TextInput-2" } })?.setOutput(
    "Hello World"
  );
  await runtimeEngine.run();

  //   console.log(
  //     find(runtimeEngine.nodes, {
  //       state: { node_id: "TextOutput-3" },
  //     })?.output
  //   );
});

// runtimeEngine.run()
