import { callDalleApi } from "@/utils/apicalls/dalle";
import { callGPTApi } from "@/utils/apicalls/gpt";
import ky from "ky";
import { filter, find, forEach, groupBy, keyBy } from "lodash";

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
  run(inputs?: any[]) {}

  setOutput(output: any) {
    if (this.output !== output) {
      this.output = output;
      this.dispatchEvent(new Event("change"));
    }
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
    const generatedOutput = await callGPTApi(
      this.state.instruction ?? "",
      inputs.join(", "),
      this.state.outputs.map((output: any) => output.label).join(", ")
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

    const generatedOutput = await callDalleApi(inputs.join(", "));

    super.setOutput(generatedOutput);
    return;
  }
}

export class RuntimeEngine {
  nodes: Node[] = [];
  edges: any[] = [];

  private state: { nodes: any[]; edges: any[] } = { nodes: [], edges: [] };
  private markedForRun: { [key: string]: boolean } = {};
  //   edges: any[] = [];
  constructor() {}

  public async load(appId: string) {
    const [nodesResponse, edgesResponse] = await Promise.all([
      ky.get(`/api/nodes?appId=${appId}`).json<{ data: any[] }>(),
      ky.get(`/api/edges?appId=${appId}`).json<{ data: any[] }>(),
    ]);

    this.state = {
      nodes: nodesResponse.data,
      edges: edgesResponse.data,
    };
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
      }
    });

    const keyedByNodeId = keyBy(this.nodes, "state.node_id");

    this.nodes.forEach((node) => {
      groupBySource[node.state.node_id].forEach((edge) => {
        node.downstreamNodes.push(keyedByNodeId[edge.target]);
      });
      groupByTarget[node.state.node_id].forEach((edge) => {
        node.upstreamNodes.push(keyedByNodeId[edge.source]);
      });
      node.initialize();
      node.addEventListener("change", () => {
        this.markForRun(node);
      });
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
    const keyedByNodeId = keyBy(this.nodes, "state.node_id");
    forEach(this.markedForRun, (node, key) => {
      this.runNode(keyedByNodeId[key]);
    });
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
