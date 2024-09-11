"use client";
import React, { useCallback, useState, useEffect, useRef } from "react";
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
import { useAppDispatch, useAppSelector } from "@/store/store";
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
import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";
import Link from "next/link";

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

export default function Editor({
  appId,
  owner,
}: {
  appId: string;
  owner: string;
}) {
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

  const [isSaved, setIsSaved] = useState(true); // Track saved status
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref to store timeout ID

  // Fetch nodes and edges from the database on component mount
  useEffect(() => {
    const fetchNodesAndEdges = async () => {
      try {
        const [nodesResponse, edgesResponse] = await Promise.all([
          axios.get(`/api/nodes?appId=${appId}`),
          axios.get(`/api/edges?appId=${appId}`),
        ]);

        const fetchedNodes = await nodesResponse.data.map((node: any) => ({
          ...node,
          id: node.node_id,
          position: node.position,
        }));
        const fetchedEdges = await edgesResponse.data.map((edge: any) => ({
          ...edge,
          id: edge.id?.toString(),
        }));
        console.log("Fetched Nodes:", fetchedNodes); // Debugging log
        setNodes(fetchedNodes);
        setEdges(fetchedEdges);
      } catch (error) {
        console.error("Failed to fetch nodes and edges:", error);
      }
    };

    fetchNodesAndEdges();
  }, []);

  // Effect to load existing UI components and their positions
  useEffect(() => {
    const loadUIComponents = async () => {
      try {
        const response = await axios.get(`/api/uicomponents?appId=${appId}`);
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
        app_id: appId, // Replace with actual app ID
      }));

      try {
        // Save updated positions to the database
        await axios.post("/api/uicomponents", {
          uiComponents: uiComponentsToSave,
        });
        console.log("Saved UI Component Positions:", uiComponentsToSave); // Debugging log
        setIsSaved(true); // Set as saved
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
        app_id: appId, // Replace with actual app ID
      }));

      const edgeData = edges.map((edge) => ({
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        app_id: appId, // Replace with actual app ID
      }));

      // Save nodes and edges to the database
      await axios.post("/api/nodes", { nodes: nodeData });
      await axios.post("/api/edges", { edges: edgeData });

      console.log("Nodes and Edges saved successfully"); // Debugging log
      setIsSaved(true); // Set as saved
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
      setIsSaved(false); // Mark as unsaved
    },
    [setNodes, dispatch]
  );

  const handleRemoveNode = useCallback(
    async (nodeId: string, app_id: string) => {
      try {
        // Use node_id instead of ObjectId _id
        console.log("Deleting node with ID:", nodeId, "and app Id:", appId); // Debugging log
        await axios.delete(`/api/nodes?id=${nodeId}&appId=${appId}`);

        // Update state on the frontend
        setNodes((nds) => nds.filter((node) => node.id !== nodeId));
        setEdges((eds) =>
          eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
        );
        setIsSaved(false); // Mark as unsaved
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
      setIsSaved(false); // Mark as unsaved
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
      setIsSaved(false); // Mark as unsaved
    },
    [nodes, setNodes, dispatch, handleDataChange, handleRemoveNode]
  );

  // Debounced save effect to save nodes and edges every 30-45 seconds after changes
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (!isSaved) {
        saveNodesAndEdges();
      }
    }, 30000); // 30 seconds delay (adjust as needed)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [nodes, edges, isSaved, saveNodesAndEdges]);

  return (
    <ReactFlowProvider>
      <div style={{ display: "flex", height: "100vh" }}>
        <AppToolbar addNewNode={addNewNode} />

        <Tabs defaultValue="nodes" className="w-full">
          <div className="flex">
            <TabsList className="grid w-full grid-cols-2 w-[400px] m-2">
              <TabsTrigger value="nodes">Logic flow</TabsTrigger>
              <TabsTrigger value="preview">UI preview</TabsTrigger>
            </TabsList>
            <Link href={`/${owner}/worlds/${appId}`} passHref>
              <Button className="m-2 px-6 bg-indigo-500 hover:bg-ingido-600">
                Experience
                <PlayIcon className="w-4 h-4 ml-1 " />
              </Button>
            </Link>
            {/* Save Button */}
            <Button
              className="m-2 px-6 bg-green-500 hover:bg-green-600"
              onClick={saveNodesAndEdges}
              disabled={isSaved}
            >
              {isSaved ? "Saved" : "Save Changes"}
            </Button>
          </div>
          <TabsContent value="nodes">
            <div style={{ display: "flex", height: "93vh" }}>
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
            <div style={{ display: "flex", height: "86vh", width: "80vw" }}>
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
}
