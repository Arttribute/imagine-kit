"use client";
import React, { useCallback, useState, useEffect } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  ReactFlowProvider,
  Connection,
  Edge,
  Node,
  useNodesState,
  useEdgesState,
} from "reactflow";
import axios from "axios"; // Use axios for API requests
import { useAppDispatch, useAppSelector } from "../store/store";
import {
  addNode,
  updateNodeData,
  addEdge as addEdgeAction,
} from "@/store/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppToolbar from "@/components/tools/toolbar/AppToolbar";
import UIEditor from "@/components/UIEditor";
import "reactflow/dist/style.css";
import nodeTypes, {
  NODE_TYPE_MAPPING,
} from "@/components/imaginekit/nodes/nodeTypes";

interface ComponentPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface UIComponent {
  id: string;
  label: string;
  type: string;
}

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const nodesFromStore = useAppSelector((state) => state.flow.nodes);
  const edgesFromStore = useAppSelector((state) => state.flow.edges);

  const [nodes, setNodes, onNodesChange] = useNodesState(
    nodesFromStore.map((node) => ({
      ...node,
      position: node.position || {
        x: Math.random() * 250,
        y: Math.random() * 150,
      },
    }))
  );

  const [edges, setEdges, onEdgesChange] = useEdgesState(
    edgesFromStore.map((edge) => ({
      ...edge,
      id: edge.id?.toString() || `${edge.source}-${edge.target}`,
    }))
  );

  const [uiComponents, setUIComponents] = useState<UIComponent[]>([]);
  const [savedComponentPositions, setSavedComponentPositions] = useState<{
    [key: string]: ComponentPosition;
  }>({});

  // Effect to load existing UI components and their positions
  useEffect(() => {
    const loadUIComponents = async () => {
      try {
        const response = await axios.get("/api/uicomponents");
        const uiComponentsData = response.data;
        setSavedComponentPositions(
          uiComponentsData.reduce(
            (acc: any, component: any) => ({
              ...acc,
              [component.component_id]: {
                x: component.position.x,
                y: component.position.y,
                width: component.position.width,
                height: component.position.height,
              },
            }),
            {}
          )
        );
        console.log("Loaded UI Components Positions: ", uiComponentsData); // Debugging log
      } catch (error) {
        console.error("Failed to load UI components:", error);
      }
    };

    loadUIComponents();
  }, []);

  // Effect to filter out UI components from nodes
  useEffect(() => {
    const uiNodes = nodes
      .filter((node) => NODE_TYPE_MAPPING.ui.includes((node.type as any) ?? ""))
      .map((node) => ({
        id: node.id,
        label: node.data.label,
        type: node.type ?? "",
      }));

    console.log("Filtered UI Components from nodes: ", uiNodes); // Debugging log for UI nodes
    setUIComponents(uiNodes);
  }, [nodes]);

  const saveComponentPositions = useCallback(
    async (positions: { [key: string]: ComponentPosition }) => {
      setSavedComponentPositions(positions);

      const uiComponentsToSave = uiComponents.map((component) => ({
        component_id: component.id,
        type: component.type, // Ensure type is provided
        label: component.label, // Ensure label is provided
        position: {
          x: positions[component.id]?.x || 0,
          y: positions[component.id]?.y || 0,
          width: positions[component.id]?.width,
          height: positions[component.id]?.height,
        },
        app_id: "66d8301bf24af376594fb6b7", // Replace with actual app ID
      }));

      try {
        // Save updated positions to the database
        await axios.post("/api/uicomponents", {
          uiComponents: uiComponentsToSave,
        });
        console.log("Saved UI Component Positions:", uiComponentsToSave); // Debugging log
      } catch (error) {
        console.error("Failed to save UI component positions:", error);
      }
    },
    [uiComponents] // Add `uiComponents` to the dependency array
  );

  const saveNodesAndEdges = useCallback(async () => {
    try {
      const nodeData = nodes.map((node) => ({
        node_id: node.id, // Ensure node ID is correctly set
        type: node.type, // Ensure node type is correctly set
        name: node.data.label, // Use node label as the name
        data: {
          inputs: node.data.inputs || [], // Ensure inputs are an array
          outputs: node.data.outputs || [], // Ensure outputs are an array
          instruction: node.data.instruction || "", // Use empty string if instruction is not present
          memoryFields: node.data.memoryFields || [], // Ensure memoryFields are an array
        },
        position: {
          x: node.position.x || 0,
          y: node.position.y || 0,
        },
        app_id: "66d8301bf24af376594fb6b7", // Replace with actual app ID
      }));

      const edgeData = edges.map((edge) => ({
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        app_id: "66d8301bf24af376594fb6b7", // Replace with actual app ID
      }));

      // Save nodes and edges to the database
      await axios.post("/api/nodes", { nodes: nodeData });
      await axios.post("/api/edges", { edges: edgeData });

      console.log("Nodes and Edges saved successfully"); // Debugging log
    } catch (error) {
      console.error("Failed to save nodes and edges:", error);
    }
  }, [nodes, edges]);

  const handleDataChange = useCallback(
    (id: string, data: any) => {
      //update node input fand output field labels with field values
      if (data.inputs) {
        data.inputs = data.inputs.map((input: any) => ({
          ...input,
          label: input.value,
        }));
      }
      if (data.outputs) {
        data.outputs = data.outputs.map((output: any) => ({
          ...output,
          label: output.value,
        }));
      }

      setNodes((nds) =>
        nds.map((node) => (node.id === id ? { ...node, data } : node))
      );
      dispatch(updateNodeData({ id, data }));
    },
    [setNodes, dispatch]
  );

  const handleRemoveNode = useCallback(
    async (nodeId: string, appId: string) => {
      try {
        // Use node_id instead of ObjectId _id
        await axios.delete(
          `/api/nodes?id=${nodeId}&appId=${"66d8301bf24af376594fb6b7"}`
        );

        // Update state on the frontend
        setNodes((nds) => nds.filter((node) => node.id !== nodeId));
        setEdges((eds) =>
          eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
        );
      } catch (error) {
        console.error("Error deleting node:", error);
      }
    },
    [setNodes, setEdges]
  );

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const { source, target, sourceHandle, targetHandle } = params;
      const sourceNode = nodes.find((node) => node.id === source);
      const targetNode = nodes.find((node) => node.id === target);

      if (sourceNode && targetNode) {
        const outputIndex = parseInt(
          sourceHandle?.replace(/^(output-|field-)/, "") || "0",
          10
        );
        const inputIndex = parseInt(
          targetHandle?.replace(/^(input-|field-)/, "") || "0",
          10
        );

        const outputValue =
          sourceNode.type === "memory"
            ? sourceNode.data.memoryFields?.[outputIndex]?.value || ""
            : sourceNode.data.outputs?.[outputIndex]?.value || "";

        // Update the memory node's field when connected to another node
        if (targetNode.type === "memory") {
          const newMemoryFields = [...(targetNode.data.memoryFields || [])];
          newMemoryFields[inputIndex] = {
            ...newMemoryFields[inputIndex],
            value: outputValue,
            label:
              sourceNode.data.outputs?.[outputIndex]?.label ||
              `Memory Field ${inputIndex + 1}`, // Update label to reflect the source
          };

          handleDataChange(targetNode.id, {
            ...targetNode.data,
            memoryFields: newMemoryFields,
          });
        } else {
          // Handle normal input nodes
          const newInputs = [...(targetNode.data.inputs || [])];
          newInputs[inputIndex] = {
            ...newInputs[inputIndex],
            value: outputValue,
          };

          handleDataChange(targetNode.id, {
            ...targetNode.data,
            inputs: newInputs,
          });
        }

        // If the source node is a memory node, update its fields
        if (sourceNode.type === "memory") {
          const newMemoryFields = [...(sourceNode.data.memoryFields || [])];
          newMemoryFields[outputIndex] = {
            ...newMemoryFields[outputIndex],
            label: newMemoryFields[outputIndex]?.label || "Output Field",
          };

          handleDataChange(sourceNode.id, {
            ...sourceNode.data,
            memoryFields: newMemoryFields,
          });
        }
      }

      const newEdge = {
        ...params,
        id: `${params.source}-${params.target}`,
        data: {
          sourceHandle: params.sourceHandle,
          targetHandle: params.targetHandle,
        },
      };

      setEdges((eds) => addEdge(newEdge as Edge, eds));
      dispatch(addEdgeAction(newEdge as Edge));
    },
    [setEdges, dispatch, nodes, handleDataChange]
  );

  const addNewNode = useCallback(
    (type: keyof (typeof NODE_TYPE_MAPPING)["types"]) => {
      const id = `${type}-${nodes.length + 1}`;
      const newNode: Node = {
        id,
        type: NODE_TYPE_MAPPING.types[type],
        data: {
          ...NODE_TYPE_MAPPING.defaultData[type],
          label: `${type} Node`,
          onRemoveNode: handleRemoveNode,
          onDataChange: handleDataChange,
        },
        position: { x: Math.random() * 250, y: Math.random() * 150 },
      };
      setNodes((nds) => nds.concat(newNode));
      dispatch(
        addNode({
          id,
          type,
          data: newNode.data,
          position: {
            x: 0,
            y: 0,
          },
        })
      );
    },
    [nodes, setNodes, dispatch, handleDataChange, handleRemoveNode]
  );

  // Call saveNodesAndEdges when nodes or edges change
  useEffect(() => {
    saveNodesAndEdges();
  }, [nodes, edges, saveNodesAndEdges]);

  return (
    <ReactFlowProvider>
      <div style={{ display: "flex", height: "100vh" }}>
        <AppToolbar addNewNode={addNewNode} />

        <Tabs defaultValue="nodes" className="w-full">
          <TabsList className="grid w-full grid-cols-2 w-[400px] m-2">
            <TabsTrigger value="nodes">Logic flow</TabsTrigger>
            <TabsTrigger value="preview">UI preview</TabsTrigger>
          </TabsList>
          <TabsContent value="nodes">
            <div style={{ display: "flex", height: "100vh" }}>
              <div
                style={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <ReactFlow
                  nodes={nodes.map((node) => ({
                    ...node,
                    data: {
                      ...node.data,
                      onRemoveNode: handleRemoveNode,
                      onDataChange: handleDataChange,
                    },
                  }))}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  nodeTypes={nodeTypes}
                  fitView
                >
                  <Background />
                  <Controls />
                </ReactFlow>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="preview">
            <div style={{ display: "flex", height: "80vh", width: "64vw" }}>
              <UIEditor
                uiComponents={uiComponents}
                savedPositions={savedComponentPositions}
                savePositions={saveComponentPositions}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ReactFlowProvider>
  );
};

export default HomePage;
