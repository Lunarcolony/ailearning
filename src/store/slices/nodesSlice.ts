import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  color: string;
  order: number;
}

export interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: any;
  selected?: boolean;
  width?: number;
  height?: number;
  layerId?: string;
}

export interface Connection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourceHandle?: string;
  targetHandle?: string;
}

interface NodesState {
  nodes: Node[];
  connections: Connection[];
  selectedNodeIds: string[];
  draggedNodeId: string | null;
  clipboard: Node[];
  layers: Layer[];
  activeLayerId: string | null;
}

const initialState: NodesState = {
  nodes: [],
  connections: [],
  selectedNodeIds: [],
  draggedNodeId: null,
  clipboard: [],
  layers: [
    {
      id: 'default',
      name: 'Default Layer',
      visible: true,
      color: '#3B82F6',
      order: 0
    }
  ],
  activeLayerId: 'default'
};

const nodesSlice = createSlice({
  name: 'nodes',
  initialState,
  reducers: {
    addNode: (state, action: PayloadAction<Omit<Node, 'id'>>) => {
      const newNode: Node = {
        ...action.payload,
        id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        layerId: action.payload.layerId || state.activeLayerId || 'default'
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
    },
    // Layer management actions
    addLayer: (state, action: PayloadAction<Omit<Layer, 'id'>>) => {
      const newLayer: Layer = {
        ...action.payload,
        id: `layer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      state.layers.push(newLayer);
    },
    removeLayer: (state, action: PayloadAction<string>) => {
      const layerId = action.payload;
      if (layerId === 'default') return; // Cannot remove default layer
      
      // Move nodes from deleted layer to default layer
      state.nodes = state.nodes.map(node => 
        node.layerId === layerId ? { ...node, layerId: 'default' } : node
      );
      
      state.layers = state.layers.filter(layer => layer.id !== layerId);
      
      if (state.activeLayerId === layerId) {
        state.activeLayerId = 'default';
      }
    },
    updateLayer: (state, action: PayloadAction<{ id: string; updates: Partial<Layer> }>) => {
      const { id, updates } = action.payload;
      const layerIndex = state.layers.findIndex(layer => layer.id === id);
      if (layerIndex !== -1) {
        state.layers[layerIndex] = { ...state.layers[layerIndex], ...updates };
      }
    },
    setActiveLayer: (state, action: PayloadAction<string>) => {
      state.activeLayerId = action.payload;
    },
    toggleLayerVisibility: (state, action: PayloadAction<string>) => {
      const layer = state.layers.find(l => l.id === action.payload);
      if (layer) {
        layer.visible = !layer.visible;
      }
    },
    moveNodeToLayer: (state, action: PayloadAction<{ nodeId: string; layerId: string }>) => {
      const { nodeId, layerId } = action.payload;
      const node = state.nodes.find(n => n.id === nodeId);
      if (node) {
        node.layerId = layerId;
      }
    },
    moveSelectedNodesToLayer: (state, action: PayloadAction<string>) => {
      const layerId = action.payload;
      state.selectedNodeIds.forEach(nodeId => {
        const node = state.nodes.find(n => n.id === nodeId);
        if (node) {
          node.layerId = layerId;
        }
      });
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
  clearAll,
  addLayer,
  removeLayer,
  updateLayer,
  setActiveLayer,
  toggleLayerVisibility,
  moveNodeToLayer,
  moveSelectedNodesToLayer
} = nodesSlice.actions;

export default nodesSlice.reducer;