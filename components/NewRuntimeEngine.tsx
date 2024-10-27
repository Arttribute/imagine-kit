import { callDalleApi } from "@/utils/apicalls/dalle";
import { callGPTApi } from "@/utils/apicalls/gpt";
import ky from "ky";
import {
  find,
  findIndex,
  forEach,
  get,
  groupBy,
  keyBy,
  map,
  uniq,
  isEqual,
  cloneDeep,
} from "lodash";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { inspect } from "util";

export class Node extends EventTarget {
  downstreamNodes: Node[] = [];
  upstreamNodes: Node[] = [];
  inputs: any;
  outputs: any;
  // state: any = {};
  //   upstreamNodes: Node[] = [];

  constructor(public state: any) {
    super();
  }

  initialize() {}

  setInputs(mutFn: (inputs?: any[]) => any[]): void;
  setInputs(inputs?: any[]): void;
  setInputs(mut?: any[] | ((inputs?: any[]) => any[])) {
    console.log("Setting input");

    let inputs = typeof mut === "function" ? mut(this.inputs) : mut;
    console.log({ inputs });

    if (this.inputs !== inputs) {
      this.inputs = inputs;
      this.dispatchEvent(new Event("inputs_change"));
    }
  }

  run(inputs?: any[]) {
    console.warn("Node run not implemented");
    return;
  }

  setOutputs(outputs: any[]) {
    console.log("Setting output");
    console.log({ outputs });
    if (this.outputs !== outputs) {
      this.outputs = outputs;
      this.dispatchEvent(new Event("outputs_change"));
    }
  }
}

export class SketchPadNode extends Node {}
export class FlipCardNode extends Node {}

export class TextInputNode extends Node {
  constructor(public state: any) {
    super(state);
  }

  async run(inputs?: any[]) {
    if (!(inputs ||= this.inputs) || inputs.length === 0) {
      console.log("No inputs");
      return;
    }
    console.log("Running TextInputNode");
    const labels = uniq(map(this.state.data.inputs, "label"));

    // Handle first input and label
    const input = inputs.at(0);
    if (typeof input == "object") {
      this.setOutputs([input]);
      return;
    }
    this.setOutputs([
      {
        [labels.at(0)]: input,
      },
    ]);
    return;
  }
}

export class TextOutputNode extends Node {
  constructor(public state: any) {
    super(state);
  }

  async run(inputs?: any[]) {
    if (!(inputs ||= this.inputs) || inputs.length === 0) {
      console.log("No inputs");
      return;
    }
    console.log("Running TextOutputNode");
    const labels = uniq(map(this.state.data.inputs, "label"));

    // Handle first input and label
    const input = inputs.at(0);
    if (typeof input == "object") {
      this.setOutputs([input]);
      return;
    }
    this.setOutputs([
      {
        [labels.at(0)]: input,
      },
    ]);
    return;
  }
}

export class LLMNode extends Node {
  constructor(public state: any) {
    super(state);
  }

  async run(inputs?: any[]) {
    if (!(inputs ||= this.inputs) || inputs.length === 0) {
      console.log("No inputs");
      return;
    }
    console.log("Running LLMNode");
    // console.log({
    //   instruction: this.state.data.instruction,
    //   inputs: inputs,
    //   outputs: this.state.data.outputs,
    // });

    const aiInputs = inputs;
    const aiOutputs = this.state.data.outputs.reduce(function (obj, output) {
      obj.push({ [output.label]: "string" });
      return obj;
    }, []);

    const generatedOutput = await callGPTApi(
      this.state.data.instruction ?? "",
      JSON.stringify(aiInputs),
      JSON.stringify(aiOutputs)
    );

    const cleanedOutput = generatedOutput
      .replace(/```json/g, "") // Remove "```json" if present
      .replace(/```/g, "") // Remove trailing "```"
      .trim(); // Trim any extra spaces or newlines

    const outputData = JSON.parse(cleanedOutput);

    super.setOutputs(outputData);
    return;
  }
}
export class ImageGenNode extends Node {
  constructor(public state: any) {
    super(state);
  }

  async run(inputs?: string[]) {
    if (!(inputs ||= this.inputs)) {
      return;
    }

    console.log("Running ImageGenNode");
    const generatedOutput = await callDalleApi(inputs.join(", "));

    super.setOutputs([generatedOutput]);
    return;
  }
}

export class RuntimeEngine extends EventTarget {
  nodes: Node[] = [];
  isRunning: boolean = false;
  //   edges: any[] = [];

  private state: { nodes: any[]; edges: any[] } = { nodes: [], edges: [] };
  private markedForRun: { [key: string]: boolean } = {};
  //   edges: any[] = [];
  constructor() {
    super();
  }

  public async load(appId: string) {
    const [nodesResponse, edgesResponse] = await Promise.all([
      ky
        .get(`api/nodes?appId=${appId}`, { prefixUrl: process.env.PREFIX_URL })
        .json<any[]>(),
      ky
        .get(`api/edges?appId=${appId}`, { prefixUrl: process.env.PREFIX_URL })
        .json<any[]>(),
    ]);

    this.state = {
      nodes: nodesResponse,
      edges: edgesResponse,
    };

    console.log("Loaded nodes and edges");
    console.log(inspect(this.state, { depth: null }));
  }

  public compile() {
    // Compile the graph
    const groupBySource = groupBy(this.state.edges, "source");
    const groupByTarget = groupBy(this.state.edges, "target");

    this.nodes = [];

    this.state.nodes.forEach((node) => {
      switch (node.type) {
        case "llm":
          this.nodes.push(new LLMNode(node));
          break;
        case "imageGen":
          this.nodes.push(new ImageGenNode(node));
          break;
        case "textOutput":
          this.nodes.push(new TextOutputNode(node));
          break;
        case "textInput":
          this.nodes.push(new TextInputNode(node));
          break;
        default:
          this.nodes.push(new Node(node));
          break;
      }
    });

    const keyedByNodeId = keyBy(this.nodes, "state.node_id");

    this.nodes.forEach((node) => {
      groupBySource[node.state.node_id]?.forEach((edge) => {
        node.downstreamNodes.push(keyedByNodeId[edge.target]);
      });
      groupByTarget[node.state.node_id]?.forEach((edge) => {
        node.upstreamNodes.push(keyedByNodeId[edge.source]);
      });
      node.initialize();
      node.addEventListener("inputs_change", () => {
        console.log("Node input changed", node.state.node_id);
        // console.log(node);
        this.markForRun(node);
      });
    });

    console.log("Compiled nodes");
    console.log(this.nodes);
    this.nodes.forEach((node) => {
      console.log(node.state.node_id);
      console.log(node.upstreamNodes);
      console.log(node.downstreamNodes);
    });
  }

  private markForRun(node: Node) {
    if (this.markedForRun[node.state.node_id]) {
      return;
    }

    this.markedForRun[node.state.node_id] = true;
    this.nodePromises[node.state.node_id] = undefined;
    node.downstreamNodes.forEach((downstreamNode) => {
      this.markForRun(downstreamNode);
    });
  }

  private nodePromises: { [key: string]: Promise<any> | undefined } = {};
  private async runNode(node: Node): Promise<any> {
    if (this.nodePromises[node.state.node_id]) {
      return this.nodePromises[node.state.node_id];
    }
    if (
      node.upstreamNodes.some((node) => this.markedForRun[node.state.node_id])
    ) {
      // Create a promise that would be resolved once all the upstream nodes have been run
      const resolution = Promise.all(
        node.upstreamNodes.map((node) => this.runNode(node))
      );
      return (this.nodePromises[node.state.node_id] = resolution
        .then(() => {
          node.upstreamNodes.length &&
            node.setInputs(node.upstreamNodes.flatMap((node) => node.outputs));
          return node.run();
        })
        .then(() => {
          this.markedForRun[node.state.node_id] = false;
        }));
    } else {
      return (this.nodePromises[node.state.node_id] = new Promise<void>(
        (res, rej) => {
          node.upstreamNodes.length &&
            node.setInputs(node.upstreamNodes.flatMap((node) => node.outputs));
          node.run();
          res();
        }
      ).then(() => {
        this.markedForRun[node.state.node_id] = false;
      }));
    }
  }

  public async run() {
    console.log(">>>>>Engine Run: START<<<<<");
    console.log(this.markedForRun);
    this.isRunning = true;
    const keyedByNodeId = keyBy(this.nodes, "state.node_id");
    const result = await Promise.all(
      map(this.markedForRun, (node, key) => {
        return this.runNode(keyedByNodeId[key]);
      })
    );
    this.isRunning = false;
    console.log(">>>>>Engine Run:  END <<<<<");
    console.log(this.markedForRun);
    return result;
  }

  public listen(nodeId: string, event: string, callback: (node: Node) => void) {
    const node = find(this.nodes, { state: { node_id: nodeId } });
    node?.addEventListener(event, () => {
      callback(node);
    });
  }
}

export function useRuntimeEngine(appId?: string) {
  const [engine, setEngine] = useState<RuntimeEngine>(new RuntimeEngine());

  useEffect(() => {
    if (appId) {
      engine.load(appId).then(() => {
        engine.compile();
      });
    }
  }, []);

  const form = useForm({});

  useEffect(() => {
    const subscription = form.watch((value, info) => {
      // We can try something like each node is an object and has nested inputs
      // like and llm node would be:
      // {
      // 	[node.id]: {
      // 		"input1": "value1",
      // 		"input2": "value2"
      // 	}
      // }

      const { name, type, values } = info;

      if (name && type == "change") {
        const [node_id, label_id] = name?.split(".") || [];
        const inputValue = get(values, name);

        // Get the node

        const node = find(engine?.nodes, { state: { node_id } });
        if (!node) {
          return;
        }

        // Get the inputs
        const input = { [label_id]: inputValue };

        // Set the node's input values
        // Run the node
        node.setInputs((prevInputs) => {
          //   const prevInputs = [..._];
          let label;
          if ("label" in input) {
            label = input.label;
          } else {
            label = Object.keys(input)[0];
          }

          if (!prevInputs) {
            return [input];
          }

          const index = findIndex(prevInputs, (input) => {
            if ("label" in input) {
              return label == input.label;
            } else {
              return label == Object.keys(input)[0];
            }
          });

          if (index > -1) {
            prevInputs?.splice(index, 1, input);
          } else {
            prevInputs?.push(input);
          }

          return [...prevInputs];
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [form.watch]);

  //   engine?.nodes.forEach((node) => {
  //     form.watch(node.state.node_id);
  //   });

  // form.register("node_id.label_id")

  return [form, engine] as const;
}
