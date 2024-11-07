"use client";
import React, { useCallback, useEffect } from "react";
import { useAppDispatch } from "@/store/store";
import { addNode, updateNodeData } from "@/store/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppToolbar from "@/components/tools/toolbar/AppToolbar";
import EditWorldMetadata from "@/components/worlds/EditWorldMetadata";
import UIPreview from "@/components/editor/UIPreview";
import { Button } from "@/components/ui/button";
import {
  PlayIcon,
  CircleCheckBigIcon,
  Loader2Icon,
  AlertTriangleIcon,
  Undo2Icon,
  Redo2Icon,
} from "lucide-react";
import Link from "next/link";
import LoadingWorld from "@/components/worlds/LoadingWorld";
import AccountMenu from "@/components/account/AccountMenu";
import useFlowData from "@/components/editor/hooks/useFlowData";
import useEditorHistory from "@/components/editor/hooks/useEditorHistory";
import NodeFlow from "./NodeFlow";
import { Node } from "reactflow";
import { NODE_TYPE_MAPPING } from "@/components/imaginekit/nodes/nodeTypes";
import Sophia from "@/components/sophia/Sophia";

interface EditorProps {
  appId: string;
  owner: string;
}

const Editor: React.FC<EditorProps> = ({ appId, owner }) => {
  const connectionColors = ["#f44336", "#9c27b0", "#2196f3", "#43a047"];
  const dispatch = useAppDispatch();

  const {
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
    saveNodesEdgesAndUIComponents,
  } = useFlowData(appId);

  const {
    saveToHistory,
    handleUndo,
    handleRedo,
    historyLength,
    redoStackLength,
  } = useEditorHistory(nodes, edges);

  const handleDataChange = useCallback(
    (id: string, data: any) => {
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
        edges.forEach((edge) => {
          if (edge.source === id) {
            const targetNode = nodes.find((node) => node.id === edge.target);
            if (targetNode) {
              // Extract indices from the edge handles
              const outputIndex = parseInt(
                edge.data.sourceHandle?.replace(/^(output-|field-)/, "") || "0",
                10
              );
              const inputIndex = parseInt(
                edge.data.targetHandle?.replace(/^(input-|field-)/, "") || "0",
                10
              );

              // Clone the target node's inputs
              const newInputs = [...(targetNode.data.inputs || [])];

              // Debug logs
              console.log("newInputs", newInputs);
              console.log("inputIndex", inputIndex);
              console.log(
                "data.outputs[outputIndex].value",
                data.outputs[outputIndex]?.value
              );

              // Safely update the target node's input
              if (data.outputs[outputIndex] && newInputs[inputIndex]) {
                newInputs[inputIndex] = {
                  ...newInputs[inputIndex],
                  value: data.outputs[outputIndex].value,
                  color: edge.data.color,
                };

                // Recursively update the target node
                handleDataChange(edge.target, {
                  ...targetNode.data,
                  inputs: newInputs,
                });
              } else {
                console.warn(
                  `Undefined data at outputIndex ${outputIndex} or inputIndex ${inputIndex}`
                );
              }
            }
          }
        });
      }

      setNodes((nds) =>
        nds.map((node) => (node.id === id ? { ...node, data } : node))
      );
      dispatch(updateNodeData({ id, data }));
      setSaveStatus("save changes");
    },
    [setNodes, dispatch, edges, nodes]
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
      setSaveStatus("save changes");
    },
    [nodes, setNodes, dispatch, handleDataChange, handleRemoveNode]
  );

  // Keyboard shortcuts for undo and redo
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "z") {
        if (event.shiftKey) {
          const nextState = handleRedo();
          if (nextState) {
            setNodes(nextState.nodes);
            setEdges(nextState.edges);
          }
        } else {
          const previousState = handleUndo();
          if (previousState) {
            setNodes(previousState.nodes);
            setEdges(previousState.edges);
          }
        }
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown as any);
    return () => {
      window.removeEventListener("keydown", handleKeyDown as any);
    };
  }, [handleUndo, handleRedo]);

  return (
    <div
      className="overflow-hidden bg-slate-50"
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
            disabled={saveStatus === "saving"}
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
          <div className="flex m-2 ml-1 p-0.5">
            <button
              onClick={() => {
                const previousState = handleUndo();
                if (previousState) {
                  setNodes(previousState.nodes);
                  setEdges(previousState.edges);
                }
              }}
              disabled={historyLength === 0}
              className="border px-3 rounded-xl bg-white hover:bg-gray-100"
            >
              <Undo2Icon
                className={`w-4 h-4
                ${historyLength === 0 ? "text-gray-300" : "text-gray-700"}
                  `}
              />
            </button>
            <button
              onClick={() => {
                const nextState = handleRedo();
                if (nextState) {
                  setNodes(nextState.nodes);
                  setEdges(nextState.edges);
                }
              }}
              disabled={redoStackLength === 0}
              className="border px-3 rounded-xl bg-white hover:bg-gray-100 ml-1"
            >
              <Redo2Icon
                className={`w-4 h-4
                ${redoStackLength === 0 ? "text-gray-300" : "text-gray-700"}
                  `}
              />
            </button>
          </div>

          <div className="flex-grow" />
          <div className="m-2">
            <AccountMenu />
          </div>
        </div>
        {loadingWorldComponents && <LoadingWorld />}
        <TabsContent value="nodes" className="bg-white">
          <div style={{ display: "flex", height: "91vh" }}>
            <div
              style={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <NodeFlow
                nodes={nodes}
                setNodes={setNodes}
                edges={edges}
                setEdges={setEdges}
                handleRemoveNode={handleRemoveNode}
                handleDataChange={handleDataChange}
                onSaveToHistory={saveToHistory}
                connectionColors={connectionColors}
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="preview" className="bg-white">
          <div style={{ display: "flex", height: "86vh", width: "80vw" }}>
            <UIPreview
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
      <div className="absolute right-0 m-4 bottom-0">
        <Sophia
          nodes={nodes}
          edges={edges}
          appData={appData}
          setNodes={setNodes}
          setEdges={setEdges}
          saveToHistory={saveToHistory}
        />
      </div>
    </div>
  );
};

export default Editor;
