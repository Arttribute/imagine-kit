import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

interface NodeData {
  position: { x: number; y: number };
  id: string;
  type: string;
  data: any;
  inputs?: any[];
  outputs?: any[];
}

interface EdgeData {
  id: any;
  source: string;
  target: string;
}

interface FlowState {
  nodes: NodeData[];
  edges: EdgeData[];
}

// Define the slice for managing nodes and edges
const flowSlice = createSlice({
  name: "flow",
  initialState: {
    nodes: [],
    edges: [],
  } as FlowState,
  reducers: {
    addNode: (state, action: PayloadAction<NodeData>) => {
      state.nodes.push(action.payload);
    },
    updateNodeData: (
      state,
      action: PayloadAction<{ id: string; data: any }>
    ) => {
      const index = state.nodes.findIndex(
        (node) => node.id === action.payload.id
      );
      if (index !== -1) {
        state.nodes[index].data = action.payload.data;
      }
    },
    addEdge: (state, action: PayloadAction<EdgeData>) => {
      state.edges.push(action.payload);
    },
    updateEdgeData: (state, action: PayloadAction<EdgeData>) => {
      const index = state.edges.findIndex(
        (edge) =>
          edge.source === action.payload.source &&
          edge.target === action.payload.target
      );
      if (index !== -1) {
        state.edges[index] = action.payload;
      }
    },
  },
});

export const { addNode, updateNodeData, addEdge, updateEdgeData } =
  flowSlice.actions;

const store = configureStore({
  reducer: {
    flow: flowSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
