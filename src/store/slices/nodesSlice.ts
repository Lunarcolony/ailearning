import { createSlice, PayloadAction, createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { NodeData, Connection, Position } from '../../types';

// Entity adapters for normalized state
const nodesAdapter = createEntityAdapter<NodeData>({
  selectId: (node) => node.id,
  sortComparer: (a, b) => a.createdAt - b.createdAt,
});

const connectionsAdapter = createEntityAdapter<Connection>({
  selectId: (connection) => connection.id,
  sortComparer: (a, b) => a.createdAt - b.createdAt,
});

interface NodesState {
  nodes: EntityState<NodeData>;
  connections: EntityState<Connection>;
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
    addNode: (state, action: PayloadAction<Omit<NodeData, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const now = Date.now();
      const newNode: NodeData = {
        ...action.payload,
        id: `node_${now}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: now,
        updatedAt: now,
      };
      nodesAdapter.addOne(state.nodes, newNode);
      state.lastAction = 'addNode';
    },
    removeNode: (state, action: PayloadAction<string>) => {
      const nodeId = action.payload;
      nodesAdapter.removeOne(state.nodes, nodeId);
      
      // Remove all connections involving this node
      const connectionIds = Object.values(state.connections.entities)
        .filter(conn => conn && (conn.sourceNodeId === nodeId || conn.targetNodeId === nodeId))
        .map(conn => conn!.id);
      connectionsAdapter.removeMany(state.connections, connectionIds);
      
      // Remove from selection
      state.selectedNodeIds = state.selectedNodeIds.filter(id => id !== nodeId);
      state.lastAction = 'removeNode';
    },
    updateNode: (state, action: PayloadAction<{ id: string; updates: Partial<NodeData> }>) => {
      const { id, updates } = action.payload;
      const updatedNode = {
        ...updates,
        updatedAt: Date.now(),
      };
      nodesAdapter.updateOne(state.nodes, { id, changes: updatedNode });
      state.lastAction = 'updateNode';
    },
    moveNode: (state, action: PayloadAction<{ id: string; position: Position }>) => {
      const { id, position } = action.payload;
      nodesAdapter.updateOne(state.nodes, {
        id,
        changes: { position, updatedAt: Date.now() }
      });
      state.lastAction = 'moveNode';
    },
    addConnection: (state, action: PayloadAction<Omit<Connection, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const now = Date.now();
      const newConnection: Connection = {
        ...action.payload,
        id: `conn_${now}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: now,
        updatedAt: now,
      };
      connectionsAdapter.addOne(state.connections, newConnection);
      state.lastAction = 'addConnection';
    },
    removeConnection: (state, action: PayloadAction<string>) => {
      connectionsAdapter.removeOne(state.connections, action.payload);
      state.selectedConnectionIds = state.selectedConnectionIds.filter(id => id !== action.payload);
      state.lastAction = 'removeConnection';
    },
    updateConnection: (state, action: PayloadAction<{ id: string; updates: Partial<Connection> }>) => {
      const { id, updates } = action.payload;
      const updatedConnection = {
        ...updates,
        updatedAt: Date.now(),
      };
      connectionsAdapter.updateOne(state.connections, { id, changes: updatedConnection });
      state.lastAction = 'updateConnection';
    },
    selectNode: (state, action: PayloadAction<{ id: string; addToSelection?: boolean }>) => {
      const { id, addToSelection = false } = action.payload;
      if (!addToSelection) {
        state.selectedNodeIds = [id];
      } else if (!state.selectedNodeIds.includes(id)) {
        state.selectedNodeIds.push(id);
      }
      // Update node selection state
      nodesAdapter.updateOne(state.nodes, { id, changes: { selected: true } });
    },
    deselectNode: (state, action: PayloadAction<string>) => {
      const nodeId = action.payload;
      state.selectedNodeIds = state.selectedNodeIds.filter(id => id !== nodeId);
      nodesAdapter.updateOne(state.nodes, { id: nodeId, changes: { selected: false } });
    },
    clearSelection: (state) => {
      // Update all selected nodes
      state.selectedNodeIds.forEach(id => {
        nodesAdapter.updateOne(state.nodes, { id, changes: { selected: false } });
      });
      state.selectedConnectionIds.forEach(id => {
        connectionsAdapter.updateOne(state.connections, { id, changes: { selected: false } });
      });
      state.selectedNodeIds = [];
      state.selectedConnectionIds = [];
    },
    setSelectedNodes: (state, action: PayloadAction<string[]>) => {
      // Clear previous selections
      state.selectedNodeIds.forEach(id => {
        nodesAdapter.updateOne(state.nodes, { id, changes: { selected: false } });
      });
      // Set new selections
      action.payload.forEach(id => {
        nodesAdapter.updateOne(state.nodes, { id, changes: { selected: true } });
      });
      state.selectedNodeIds = action.payload;
    },
    selectConnection: (state, action: PayloadAction<{ id: string; addToSelection?: boolean }>) => {
      const { id, addToSelection = false } = action.payload;
      if (!addToSelection) {
        state.selectedConnectionIds = [id];
      } else if (!state.selectedConnectionIds.includes(id)) {
        state.selectedConnectionIds.push(id);
      }
      connectionsAdapter.updateOne(state.connections, { id, changes: { selected: true } });
    },
    deselectConnection: (state, action: PayloadAction<string>) => {
      const connectionId = action.payload;
      state.selectedConnectionIds = state.selectedConnectionIds.filter(id => id !== connectionId);
      connectionsAdapter.updateOne(state.connections, { id: connectionId, changes: { selected: false } });
    },
    setDraggedNode: (state, action: PayloadAction<string | null>) => {
      state.draggedNodeId = action.payload;
    },
    copySelectedNodes: (state) => {
      const selectedNodes = state.selectedNodeIds
        .map(id => state.nodes.entities[id])
        .filter((node): node is NodeData => node !== undefined);
      
      const selectedConnections = Object.values(state.connections.entities)
        .filter((conn): conn is Connection => 
          conn !== undefined && 
          state.selectedNodeIds.includes(conn.sourceNodeId) && 
          state.selectedNodeIds.includes(conn.targetNodeId)
        );

      state.clipboard = {
        nodes: selectedNodes,
        connections: selectedConnections,
      };
      state.lastAction = 'copySelectedNodes';
    },
    pasteNodes: (state, action: PayloadAction<Position>) => {
      const { x, y } = action.payload;
      const now = Date.now();
      const idMapping = new Map<string, string>();
      
      // Create new nodes
      const newNodes = state.clipboard.nodes.map(node => {
        const newId = `node_${now}_${Math.random().toString(36).substr(2, 9)}`;
        idMapping.set(node.id, newId);
        return {
          ...node,
          id: newId,
          position: { x: node.position.x + x, y: node.position.y + y },
          selected: false,
          createdAt: now,
          updatedAt: now,
        };
      });
      
      // Create new connections with updated node IDs
      const newConnections = state.clipboard.connections.map(conn => ({
        ...conn,
        id: `conn_${now}_${Math.random().toString(36).substr(2, 9)}`,
        sourceNodeId: idMapping.get(conn.sourceNodeId) || conn.sourceNodeId,
        targetNodeId: idMapping.get(conn.targetNodeId) || conn.targetNodeId,
        selected: false,
        createdAt: now,
        updatedAt: now,
      }));
      
      nodesAdapter.addMany(state.nodes, newNodes);
      connectionsAdapter.addMany(state.connections, newConnections);
      state.lastAction = 'pasteNodes';
    },
    duplicateNode: (state, action: PayloadAction<string>) => {
      const nodeId = action.payload;
      const node = state.nodes.entities[nodeId];
      if (node) {
        const now = Date.now();
        const duplicatedNode: NodeData = {
          ...node,
          id: `node_${now}_${Math.random().toString(36).substr(2, 9)}`,
          position: { x: node.position.x + 20, y: node.position.y + 20 },
          selected: false,
          createdAt: now,
          updatedAt: now,
        };
        nodesAdapter.addOne(state.nodes, duplicatedNode);
        state.lastAction = 'duplicateNode';
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetState: () => initialState,
  }
});

// Export selectors
export const nodesSelectors = nodesAdapter.getSelectors((state: { nodes: NodesState }) => state.nodes.nodes);
export const connectionsSelectors = connectionsAdapter.getSelectors((state: { nodes: NodesState }) => state.nodes.connections);

export const {
  addNode,
  removeNode,
  updateNode,
  moveNode,
  addConnection,
  removeConnection,
  updateConnection,
  selectNode,
  deselectNode,
  clearSelection,
  setSelectedNodes,
  selectConnection,
  deselectConnection,
  setDraggedNode,
  copySelectedNodes,
  pasteNodes,
  duplicateNode,
  setLoading,
  setError,
  resetState,
} = nodesSlice.actions;

export default nodesSlice.reducer;