// useFlowData.tsx
"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { Node, Edge } from "reactflow";
import { NODE_TYPE_MAPPING } from "@/components/imaginekit/nodes/nodeTypes";

interface UIComponent {
  id: string;
  label: string;
  type: string;
  fieldTypes?: string[];
}

interface ComponentPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

type SaveStatus = "save changes" | "saving" | "saved" | "failed to save";

function useFlowData(appId: string) {
  const [appData, setAppData] = useState<any>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [uiComponents, setUIComponents] = useState<UIComponent[]>([]);
  const [savedComponentPositions, setSavedComponentPositions] = useState<{
    [key: string]: ComponentPosition;
  }>({});
  const [loadingWorldComponents, setLoadingWorldComponents] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [pendingRemovals, setPendingRemovals] = useState<Set<string>>(
    new Set()
  );

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch data from the database
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

        const fetchedNodes = nodesResponse.data.map((node: any) => ({
          ...node,
          id: node.node_id,
          position: node.position,
          data: {
            ...node.data,
            knowledgeBase: node.data.knowledgeBase || {
              name: "",
              content: "",
            },
          },
        }));
        const fetchedEdges = edgesResponse.data.map((edge: any) => ({
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

        setAppData(appData);
        setNodes(fetchedNodes);
        setEdges(fetchedEdges);
        setLoadingWorldComponents(false);

        // Set saved positions from fetched UI components
        const newSavedPositions = uiComponentsData.reduce(
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
        );
        setSavedComponentPositions(newSavedPositions);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [appId]);

  // Effect to filter out UI components from nodes
  useEffect(() => {
    const uiNodes = nodes
      .filter((node) =>
        NODE_TYPE_MAPPING.ui.includes(
          node.type as (typeof NODE_TYPE_MAPPING.ui)[number]
        )
      )
      .map((node) => ({
        id: node.id,
        label: node.data.label,
        type: node.type ?? "",
        fieldTypes:
          node.data.outputs.map((output: { type: any }) => output.type) || [],
      }));

    console.log("Filtered UI Components from nodes: ", uiNodes); // Debugging log for UI nodes
    setUIComponents(uiNodes);
  }, [nodes]);

  // Effect to set savedComponentPositions based on uiComponents
  useEffect(() => {
    const newSavedPositions = uiComponents.reduce(
      (acc: any, component: any) => ({
        ...acc,
        [component.id]: savedComponentPositions[component.id] || {
          x: Math.random() * 200,
          y: Math.random() * 200,
          width: 200,
          height: 100,
        },
      }),
      {}
    );
    setSavedComponentPositions(newSavedPositions);
  }, [uiComponents]);

  // Debounced save effect
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (saveStatus === "save changes") {
        saveNodesEdgesAndUIComponents();
      }
    }, 5000); // Adjust the delay as needed

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [nodes, edges, uiComponents, savedComponentPositions, saveStatus]);

  // Save function
  const saveNodesEdgesAndUIComponents = useCallback(async () => {
    setSaveStatus("saving");
    try {
      const nodeData = nodes
        .filter((node) => !pendingRemovals.has(node.id))
        .map((node) => ({
          node_id: node.id,
          type: node.type,
          name: node.data.label,
          data: {
            inputs: node.data.inputs || [],
            outputs: node.data.outputs || [],
            instruction: node.data.instruction || "",
            memoryFields: node.data.memoryFields || [],
            knowledgeBase: node.data.knowledgeBase || {
              name: "",
              content: "",
            },
          },
          position: {
            x: node.position.x || 0,
            y: node.position.y || 0,
          },
          app_id: appId,
        }));

      const edgeData = edges
        .filter((edge) => {
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
          color: edge.data.color || "",
          app_id: appId,
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
        app_id: appId,
      }));

      await axios.post("/api/nodes", { nodes: nodeData });
      await axios.post("/api/edges", { edges: edgeData });
      await axios.post("/api/uicomponents", {
        uiComponents: uiComponentsToSave,
      });

      console.log("Nodes, Edges, and UI Components saved successfully");
      setSaveStatus("saved");

      // Remove nodes marked for deletion after saving
      for (const nodeId of pendingRemovals) {
        await axios.delete(`/api/nodes?id=${nodeId}&appId=${appId}`);
      }
      setPendingRemovals(new Set());
    } catch (error) {
      console.error("Failed to save nodes, edges, or UI components:", error);
      setSaveStatus("failed to save");
    }
  }, [
    nodes,
    edges,
    uiComponents,
    savedComponentPositions,
    pendingRemovals,
    appId,
  ]);

  const saveComponentPositions = useCallback(
    async (positions: { [key: string]: ComponentPosition }) => {
      setSavedComponentPositions(positions);

      const uiComponentsToSave = uiComponents.map((component) => ({
        component_id: component.id,
        type: component.type,
        label: component.label,
        position: {
          x: positions[component.id]?.x || 0,
          y: positions[component.id]?.y || 0,
          width: positions[component.id]?.width,
          height: positions[component.id]?.height,
        },
        app_id: appId,
      }));

      try {
        await axios.post("/api/uicomponents", {
          uiComponents: uiComponentsToSave,
        });
        console.log("Saved UI Component Positions:", uiComponentsToSave);
        setSaveStatus("saved");
      } catch (error) {
        console.error("Failed to save UI component positions:", error);
        setSaveStatus("failed to save");
      }
    },
    [uiComponents, appId]
  );

  const handleRemoveNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
    setPendingRemovals((prev) => new Set(prev).add(nodeId));
    setSaveStatus("save changes");
  }, []);

  return {
    appData,
    nodes,
    setNodes,
    edges,
    setEdges,
    uiComponents,
    savedComponentPositions,
    saveComponentPositions,
    loadingWorldComponents,
    saveStatus,
    setSaveStatus,
    handleRemoveNode,
    pendingRemovals,
    setPendingRemovals,
    saveNodesEdgesAndUIComponents,
  };
}

export default useFlowData;
