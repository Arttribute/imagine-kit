"use client";
import ReactFlow, { Controls, Background } from "reactflow";
import "reactflow/dist/style.css";
import nodeTypes from "@/components/imaginekit/nodes/nodeTypes";

interface NodeDiagramProps {
  data: {
    nodes: any[];
    edges: any[];
  };
}

function NodeDiagram({ data }: NodeDiagramProps) {
  const { nodes, edges } = data;

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes}>
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}

export default NodeDiagram;
