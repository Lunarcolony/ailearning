import { createSlice, PayloadAction, createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { NodeData, Connection } from '../../types';

// Entity adapters for normalized state
const nodesAdapter = createEntityAdapter<NodeData, string>({
  sortComparer: (a, b) => a.createdAt - b.createdAt,
});

const connectionsAdapter = createEntityAdapter<Connection, string>({
  sortComparer: (a, b) => a.createdAt - b.createdAt,
});

interface NodesState {
  nodes: EntityState<NodeData, string>;
  connections: EntityState<Connection, string>;
  selectedNodeIds: string[];
  selectedConnectionIds: string[];
  draggedNodeId: string | null;
  clipboard: {
    nodes: NodeData[];
    connections: Connection[];
  };
  lastAction: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: NodesState = {
  nodes: nodesAdapter.getInitialState(),
  connections: connectionsAdapter.getInitialState(),
  selectedNodeIds: [],
  selectedConnectionIds: [],
  draggedNodeId: null,
  clipboard: {
    nodes: [],
    connections: [],
  },
  lastAction: null,
  isLoading: false,
  error: null,
};

const nodesSlice = createSlice({
  name: 'nodes',
  initialState,
  reducers: {
    addNode: (state, action: PayloadAction<Omit<Node, 'id'>>) => {
      const newNode: Node = {
        ...action.payload,
        id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      state.nodes.push(newNode);
    },
    removeNode: (state, action: PayloadAction<string>) => {
      const nodeId = action.payload;
      state.nodes = state.nodes.filter(node => node.id !== nodeId);
      state.connections = state.connections.filter(
        conn => conn.sourceNodeId !== nodeId && conn.targetNodeId !== nodeId
      );
      state.selectedNodeIds = state.selectedNodeIds.filter(id => id !== nodeId);
    },
    updateNode: (state, action: PayloadAction<{ id: string; updates: Partial<Node> }>) => {
      const { id, updates } = action.payload;
      const nodeIndex = state.nodes.findIndex(node => node.id === id);
      if (nodeIndex !== -1) {
        state.nodes[nodeIndex] = { ...state.nodes[nodeIndex], ...updates };
      }
    },
    moveNode: (state, action: PayloadAction<{ id: string; position: { x: number; y: number } }>) => {
      const { id, position } = action.payload;
      const node = state.nodes.find(node => node.id === id);
      if (node) {
        node.position = position;
      }
    },
    addConnection: (state, action: PayloadAction<Omit<Connection, 'id'>>) => {
      const newConnection: Connection = {
        ...action.payload,
        id: `connection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      state.connections.push(newConnection);
    },
    removeConnection: (state, action: PayloadAction<string>) => {
      state.connections = state.connections.filter(conn => conn.id !== action.payload);
    },
    selectNode: (state, action: PayloadAction<{ nodeId: string; multiSelect?: boolean }>) => {
      const { nodeId, multiSelect = false } = action.payload;
      if (multiSelect) {
        if (state.selectedNodeIds.includes(nodeId)) {
          state.selectedNodeIds = state.selectedNodeIds.filter(id => id !== nodeId);
        } else {
          state.selectedNodeIds.push(nodeId);
        }
      } else {
        state.selectedNodeIds = [nodeId];
      }
    },
    clearSelection: (state) => {
      state.selectedNodeIds = [];
    },
    setDraggedNode: (state, action: PayloadAction<string | null>) => {
      state.draggedNodeId = action.payload;
    },
    copySelectedNodes: (state) => {
      state.clipboard = state.nodes.filter(node => 
        state.selectedNodeIds.includes(node.id)
      );
    },
    pasteNodes: (state, action: PayloadAction<{ x: number; y: number }>) => {
      const { x, y } = action.payload;
      const newNodes = state.clipboard.map(node => ({
        ...node,
        id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        position: {
          x: node.position.x + x,
          y: node.position.y + y
        }
      }));
      state.nodes.push(...newNodes);
    },
    clearAll: (state) => {
      state.nodes = [];
      state.connections = [];
      state.selectedNodeIds = [];
      state.draggedNodeId = null;
    }
  }
});

export const {
  addNode,
  removeNode,
  updateNode,
  moveNode,
  addConnection,
  removeConnection,
  selectNode,
  clearSelection,
  setDraggedNode,
  copySelectedNodes,
  pasteNodes,
  clearAll
} = nodesSlice.actions;

export default nodesSlice.reducer;