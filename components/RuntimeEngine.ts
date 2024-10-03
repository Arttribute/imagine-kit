import { callDalleApi } from "@/utils/apicalls/dalle";
import { callGPTApi } from "@/utils/apicalls/gpt";
import ky from "ky";
import {
  filter,
  find,
  flatMap,
  forEach,
  get,
  groupBy,
  keyBy,
  map,
  uniq,
} from "lodash";
import { inspect } from "util";

export class Node extends EventTarget {
  downstreamNodes: Node[] = [];
  upstreamNodes: Node[] = [];
  output: any;
  // state: any = {};
  //   upstreamNodes: Node[] = [];

  constructor(public state: any) {
    super();
  }

  initialize() {}
  run(inputs?: any[]) {
    console.log("Running Node");
    return;
  }

  setOutput(output: any) {
    console.log("Setting output");
    console.log({ output });
    if (this.output !== output) {
      this.output = output;
      this.dispatchEvent(new Event("change"));
    }
  }
}

export class TextOutputNode extends Node {
  constructor(public state: any) {
    super(state);
  }

  async run(inputs?: string[]) {
    if (!inputs) {
      return;
    }
    console.log("Running TextOutputNode");
    const labels = uniq(map(this.state.data.inputs, "label"));
    const outputs = flatMap(inputs, (input) => {
      if (typeof input == "object") {
        return map(labels, (value) => {
          return get(input, value);
        });
      }
      return input;
    });

    super.setOutput(outputs.join(", "));
    return;
  }
}

export class LLMNode extends Node {
  constructor(public state: any) {
    super(state);
  }

  async run(inputs?: string[]) {
    if (!inputs) {
      return;
    }
    console.log("Running LLMNode");
    const generatedOutput = await callGPTApi(
      this.state.data.instruction ?? "",
      inputs.join(", "),
      this.state.data.outputs.map((output: any) => output.label).join(", ")
    );

    const cleanedOutput = generatedOutput
      .replace(/```json/g, "") // Remove "```json" if present
      .replace(/```/g, "") // Remove trailing "```"
      .trim(); // Trim any extra spaces or newlines

    const outputData = JSON.parse(cleanedOutput);

    super.setOutput(outputData);
    return;
  }
}
export class ImageGenNode extends Node {
  constructor(public state: any) {
    super(state);
  }

  async run(inputs?: string[]) {
    if (!inputs) {
      return;
    }

    console.log("Running ImageGenNode");
    const generatedOutput = await callDalleApi(inputs.join(", "));

    super.setOutput(generatedOutput);
    return;
  }
}

export class RuntimeEngine {
  nodes: Node[] = [];
  //   edges: any[] = [];

  private state: { nodes: any[]; edges: any[] } = { nodes: [], edges: [] };
  private markedForRun: { [key: string]: boolean } = {};
  //   edges: any[] = [];
  constructor() {}

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

  public async compile() {
    // Compile the graph
    const groupBySource = groupBy(this.state.edges, "source");
    const groupByTarget = groupBy(this.state.edges, "target");

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
      node.addEventListener("change", () => {
        console.log("Node changed", node.state.node_id);
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
          return node.run(node.upstreamNodes.map((node) => node.output));
        })
        .then(() => {
          this.markedForRun[node.state.node_id] = false;
        }));
    } else {
      return (this.nodePromises[node.state.node_id] = Promise.resolve(
        node.run(node.upstreamNodes.map((node) => node.output))
      ).then(() => {
        this.markedForRun[node.state.node_id] = false;
      }));
    }
  }

  public async run() {
    console.log(">>>>>Engine Run: START<<<<<");
    const keyedByNodeId = keyBy(this.nodes, "state.node_id");
    const result = await Promise.all(
      map(this.markedForRun, (node, key) => {
        return this.runNode(keyedByNodeId[key]);
      })
    );
    console.log(">>>>>Engine Run:  END <<<<<");
    return result;
  }

  public register(nodeId: string) {
    const node = find(this.nodes, { state: { node_id: nodeId } });
    return {
      change: () => {},
    };
  }

  public listen(nodeId: string, callback: (output: any) => void) {
    const node = find(this.nodes, { state: { node_id: nodeId } });
    node?.addEventListener("change", () => {
      callback(node.output);
    });
  }
}
