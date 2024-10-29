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
import EditWorldMetadata from "@/components/worlds/EditWorldMetadata";
import UIEditor from "@/components/UIEditor";
import "reactflow/dist/style.css";
import nodeTypes, {
  NODE_TYPE_MAPPING,
} from "@/components/imaginekit/nodes/nodeTypes";
import { Button } from "@/components/ui/button";
import {
  PlayIcon,
  CircleCheckBigIcon,
  Loader2Icon,
  AlertTriangleIcon,
} from "lucide-react";
import Link from "next/link";
import LoadingWorld from "./worlds/LoadingWorld";

import AccountMenu from "@/components/account/AccountMenu";
import { color } from "framer-motion";

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

type SaveStatus = "save changes" | "saving" | "saved" | "failed to save";

export default function Editor({
  appId,
  owner,
}: {
  appId: string;
  owner: string;
}) {
  const connectionColors = ["#f44336", "#9c27b0", "#2196f3", "#43a047"];
  const dispatch = useAppDispatch();
  const nodesFromStore = useAppSelector((state) => state.flow.nodes);
  const edgesFromStore = useAppSelector((state) => state.flow.edges);
  const [appData, setAppData] = useState<any>(null);
  const [loadingWorldComponents, setLoadingWorldComponents] = useState(false);
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
      style: { stroke: edge.color || "#000" },
    }))
  );

  const [uiComponents, setUIComponents] = useState<UIComponent[]>([]);
  const [savedComponentPositions, setSavedComponentPositions] = useState<{
    [key: string]: ComponentPosition;
  }>({});

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved"); // Manage save status
  const [pendingRemovals, setPendingRemovals] = useState<Set<string>>(
    new Set()
  ); // Track pending removals
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref to store timeout ID

  // Fetch nodes, edges, and UI components from the database on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoadingWorldComponents(true);
      try {
        const [
          appResponse,
          nodesResponse,
          edgesResponse,
          uiComponentsResponse,
        ] = await Promise.all([
          axios.get(`/api/apps/app?appId=${appId}`),
          axios.get(`/api/nodes?appId=${appId}`),
          axios.get(`/api/edges?appId=${appId}`),
          axios.get(`/api/uicomponents?appId=${appId}`),
        ]);

        const appData = appResponse.data;

        const fetchedNodes = await nodesResponse.data.map((node: any) => ({
          ...node,
          id: node.node_id,
          position: node.position,
        }));
        const fetchedEdges = await edgesResponse.data.map((edge: any) => ({
          ...edge,
          id: edge.id?.toString(),
          data: {
            sourceHandle: edge.sourceHandle,
            targetHandle: edge.targetHandle,
            color: edge.color,
          },
          style: { stroke: edge.color },
        }));
        const uiComponentsData = uiComponentsResponse.data;

        console.log("Fetched App Data:", appData); // Debugging log
        console.log("Fetched Nodes:", fetchedNodes); // Debugging log
        console.log("Fetched Edges:", fetchedEdges); // Debugging log
        console.log("Fetched UI Components Positions: ", uiComponentsData); // Debugging log

        setAppData(appData);
        setNodes(fetchedNodes);
        setEdges(fetchedEdges);
        setUIComponents(uiComponentsData);
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
        setLoadingWorldComponents(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
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
        setSaveStatus("saved"); // Set as saved
      } catch (error) {
        console.error("Failed to save UI component positions:", error);
        setSaveStatus("failed to save"); // Set to failed
      }
    },
    [uiComponents] // Add `uiComponents` to the dependency array
  );

  const saveNodesEdgesAndUIComponents = useCallback(async () => {
    setSaveStatus("saving"); // Set status to 'saving'
    try {
      const nodeData = nodes
        .filter((node) => !pendingRemovals.has(node.id)) // Exclude nodes marked for removal
        .map((node) => ({
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

      const edgeData = edges
        .filter((edge) => {
          // Exclude edges connected to nodes marked for removal
          return (
            !pendingRemovals.has(edge.source) &&
            !pendingRemovals.has(edge.target)
          );
        })
        .map((edge) => ({
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
          color: edge.data.color || "", // Ensure color is set or default to an empty string
          app_id: appId, // Replace with actual app ID
        }));

      const uiComponentsToSave = uiComponents.map((component) => ({
        component_id: component.id,
        type: component.type,
        label: component.label,
        position: {
          x: savedComponentPositions[component.id]?.x || 0,
          y: savedComponentPositions[component.id]?.y || 0,
          width: savedComponentPositions[component.id]?.width,
          height: savedComponentPositions[component.id]?.height,
        },
        app_id: appId, // Replace with actual app ID
      }));

      // Save nodes, edges, and UI components to the database
      await axios.post("/api/nodes", { nodes: nodeData });
      await axios.post("/api/edges", { edges: edgeData });
      await axios.post("/api/uicomponents", {
        uiComponents: uiComponentsToSave,
      });

      console.log("Nodes, Edges, and UI Components saved successfully"); // Debugging log
      setSaveStatus("saved"); // Set as saved
      console.log("Saved Edge Data:", edgeData); // Debugging log

      // Remove nodes marked for deletion after saving
      for (const nodeId of pendingRemovals) {
        await axios.delete(`/api/nodes?id=${nodeId}&appId=${appId}`);
      }
      setPendingRemovals(new Set()); // Clear pending removals
    } catch (error) {
      console.error("Failed to save nodes, edges, or UI components:", error);
      setSaveStatus("failed to save"); // Set to failed
    }
  }, [nodes, edges, uiComponents, savedComponentPositions, pendingRemovals]);

  const handleDataChange = useCallback(
    (id: string, data: any) => {
      // Update node input and output field labels with field values
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
      setSaveStatus("save changes"); // Mark as unsaved
    },
    [setNodes, dispatch]
  );

  const handleRemoveNode = useCallback(
    (nodeId: string) => {
      // Update state on the frontend immediately
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );

      // Mark the node for deletion on next save
      setPendingRemovals((prev) => new Set(prev).add(nodeId));
      setSaveStatus("save changes"); // Mark as unsaved
    },
    [setNodes, setEdges]
  );

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const { source, target, sourceHandle, targetHandle } = params;
      const sourceNode = nodes.find((node) => node.id === source);
      const targetNode = nodes.find((node) => node.id === target);

      //assign color - let edges of the same source have the same color
      let color = "";
      if (sourceNode) {
        const sourceIndex = nodes.findIndex((node) => node.id === source);
        color = connectionColors[sourceIndex];
      }

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
            color: color,
          };

          const newOutputs = [...(sourceNode.data.outputs || [])];
          newOutputs[outputIndex] = {
            ...newOutputs[outputIndex],
            color: color,
          };

          handleDataChange(sourceNode.id, {
            ...sourceNode.data,
            outputs: newOutputs,
          });

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
          color: color,
        },
        style: { stroke: color },
      };

      setEdges((eds) => addEdge(newEdge as Edge, eds));
      dispatch(addEdgeAction(newEdge as Edge));
      setSaveStatus("save changes"); // Mark as unsaved when edges are changed
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
      setSaveStatus("save changes"); // Mark as unsaved when a new node is added
    },
    [nodes, setNodes, dispatch, handleDataChange, handleRemoveNode]
  );

  // Debounced save effect to save nodes, edges, and UI components every 30-45 seconds after changes
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (saveStatus === "save changes") {
        saveNodesEdgesAndUIComponents();
      }
    }, 5000); // 5 seconds delay (adjust as needed)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [
    nodes,
    edges,
    uiComponents,
    savedComponentPositions,
    saveStatus,
    saveNodesEdgesAndUIComponents,
  ]);

  return (
    <ReactFlowProvider>
      <div
        className="overflow-hidden"
        style={{ display: "flex", height: "100vh" }}
      >
        <AppToolbar addNewNode={addNewNode} />

        <Tabs defaultValue="nodes" className="w-full">
          <div className="flex">
            <div className="m-2">
              <EditWorldMetadata appData={appData} />
            </div>
            <TabsList className="grid w-full grid-cols-2 w-[400px] m-2">
              <TabsTrigger value="nodes">Logic flow</TabsTrigger>
              <TabsTrigger value="preview">UI preview</TabsTrigger>
            </TabsList>
            <Link href={`/${owner}/worlds/${appId}`} passHref>
              <Button className="m-2 px-6 bg-indigo-500 hover:bg-indigo-600">
                Experience
                <PlayIcon className="w-4 h-4 ml-1 " />
              </Button>
            </Link>

            {/* Save Button */}
            <button
              className={`flex items-center justify-center text-xs m-2 px-6 py-1 border rounded-full bg-white  ${
                saveStatus === "saved"
                  ? "text-green-600 border-green-500"
                  : saveStatus === "failed to save"
                  ? "text-red-600 border-red-500"
                  : saveStatus === "saving"
                  ? "text-gray-700 border-gray-400"
                  : "text-blue-700 border-blue-400"
              } hover:bg-gray-100`}
              onClick={saveNodesEdgesAndUIComponents}
              disabled={saveStatus === "saving"} // Disable button while saving
            >
              {saveStatus === "saving" && "Saving"}
              {saveStatus === "save changes" && "Save Changes"}
              {saveStatus === "saved" && "Saved"}
              {saveStatus === "failed to save" && "Failed to Save"}

              {saveStatus === "saving" && (
                <Loader2Icon className="w-3 h-3 ml-1 animate-spin" />
              )}
              {saveStatus === "saved" && (
                <CircleCheckBigIcon className="w-3 h-3 ml-1" />
              )}
              {saveStatus === "failed to save" && (
                <AlertTriangleIcon className="w-3 h-3 ml-1" />
              )}
            </button>

            <div className="flex-grow" />
            <div className="m-2">
              <AccountMenu />
            </div>
          </div>
          {loadingWorldComponents && <LoadingWorld />}
          <TabsContent value="nodes">
            <div style={{ display: "flex", height: "91vh" }}>
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
                  onNodesChange={(changes) => {
                    onNodesChange(changes);
                    setSaveStatus("save changes"); // Mark as unsaved when nodes are changed
                  }}
                  onEdgesChange={(changes) => {
                    onEdgesChange(changes);
                    setSaveStatus("save changes"); // Mark as unsaved when edges are changed
                  }}
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
                savePositions={(positions) => {
                  saveComponentPositions(positions);
                  setSaveStatus("save changes"); // Mark as unsaved when UI components are changed
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ReactFlowProvider>
  );
}
