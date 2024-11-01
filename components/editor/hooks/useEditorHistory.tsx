"use client";
import { useState } from "react";
import { Node, Edge } from "reactflow";

function useEditorHistory(nodes: Node[], edges: Edge[]) {
  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>(
    []
  );
  const [redoStack, setRedoStack] = useState<
    { nodes: Node[]; edges: Edge[] }[]
  >([]);

  // Save the current state to the history stack
  const saveToHistory = () => {
    setHistory((prevHistory) => [...prevHistory, { nodes, edges }]);
    setRedoStack([]); // Clear redo stack on new action
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setRedoStack((prevRedo) => [...prevRedo, { nodes, edges }]);
      setHistory((prevHistory) => prevHistory.slice(0, -1));
      return previousState;
    }
    return null;
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      setHistory((prevHistory) => [...prevHistory, { nodes, edges }]);
      setRedoStack((prevRedo) => prevRedo.slice(0, -1));
      return nextState;
    }
    return null;
  };

  return {
    saveToHistory,
    handleUndo,
    handleRedo,
    historyLength: history.length,
    redoStackLength: redoStack.length,
  };
}

export default useEditorHistory;
