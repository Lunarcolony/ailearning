import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WorkspaceState, Position, Layer, NetworkArchitecture } from '../../types';
import { CANVAS_CONSTANTS, DEFAULT_CANVAS_CONFIG } from '../../constants';

interface EnhancedWorkspaceState extends Omit<WorkspaceState, 'nodes' | 'connections'> {
  // Canvas/viewport state
  viewport: {
    scale: number;
    panOffset: Position;
    bounds: {
      minX: number;
      maxX: number;
      minY: number;
      maxY: number;
    };
  };
  
  // Grid configuration
  grid: {
    enabled: boolean;
    size: number;
    snapToGrid: boolean;
    visible: boolean;
    color: string;
    opacity: number;
  };
  
  // UI state
  ui: {
    selectedTool: 'select' | 'pan' | 'connection' | 'node' | null;
    miniMapVisible: boolean;
    propertiesPanelVisible: boolean;
    layersPanelVisible: boolean;
    nodePaletteVisible: boolean;
    contextMenuPosition: Position | null;
    isLoading: boolean;
    loadingMessage: string | null;
  };
  
  // History for undo/redo
  history: {
    past: any[];
    future: any[];
    maxHistorySize: number;
    canUndo: boolean;
    canRedo: boolean;
  };
  
  // Performance settings
  performance: {
    enableVirtualization: boolean;
    renderOptimization: boolean;
    maxVisibleNodes: number;
    lowPerformanceMode: boolean;
  };
  
  // Network architecture
  architecture: NetworkArchitecture | null;
  
  // File operations
  file: {
    name: string;
    path: string | null;
    isDirty: boolean;
    autoSave: boolean;
    lastSaved: number | null;
  };
}

const initialState: EnhancedWorkspaceState = {
  id: '',
  name: 'Untitled Workspace',
  description: undefined,
  selectedItems: {
    nodeIds: [],
    connectionIds: [],
    layerIds: [],
  },
  clipboard: {
    nodes: [],
    connections: [],
  },
  viewport: {
    scale: 1,
    panOffset: { x: 0, y: 0 },
    bounds: {
      minX: -10000,
      maxX: 10000,
      minY: -10000,
      maxY: 10000,
    },
  },
  grid: {
    enabled: DEFAULT_CANVAS_CONFIG.showGrid,
    size: DEFAULT_CANVAS_CONFIG.gridSize,
    snapToGrid: DEFAULT_CANVAS_CONFIG.snapToGrid,
    visible: true,
    color: '#e5e7eb',
    opacity: 0.5,
  },
  ui: {
    selectedTool: 'select',
    miniMapVisible: false,
    propertiesPanelVisible: true,
    layersPanelVisible: true,
    nodePaletteVisible: true,
    contextMenuPosition: null,
    isLoading: false,
    loadingMessage: null,
  },
  layers: {},
  history: {
    past: [],
    future: [],
    maxHistorySize: 100,
    canUndo: false,
    canRedo: false,
  },
  performance: {
    enableVirtualization: false,
    renderOptimization: true,
    maxVisibleNodes: 1000,
    lowPerformanceMode: false,
  },
  architecture: null,
  file: {
    name: 'Untitled',
    path: null,
    isDirty: false,
    autoSave: true,
    lastSaved: null,
  },
  metadata: {},
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    // Viewport management
    setViewport: (state, action: PayloadAction<Partial<EnhancedWorkspaceState['viewport']>>) => {
      state.viewport = { ...state.viewport, ...action.payload };
      state.updatedAt = Date.now();
    },
    
    setCanvasPosition: (state, action: PayloadAction<Position>) => {
      state.viewport.panOffset = action.payload;
      state.updatedAt = Date.now();
    },
    
    setCanvasScale: (state, action: PayloadAction<number>) => {
      const newScale = Math.min(
        Math.max(action.payload, CANVAS_CONSTANTS.MIN_ZOOM),
        CANVAS_CONSTANTS.MAX_ZOOM
      );
      state.viewport.scale = newScale;
      state.updatedAt = Date.now();
    },
    
    zoomIn: (state) => {
      const newScale = Math.min(
        state.viewport.scale + CANVAS_CONSTANTS.ZOOM_STEP,
        CANVAS_CONSTANTS.MAX_ZOOM
      );
      state.viewport.scale = newScale;
      state.updatedAt = Date.now();
    },
    
    zoomOut: (state) => {
      const newScale = Math.max(
        state.viewport.scale - CANVAS_CONSTANTS.ZOOM_STEP,
        CANVAS_CONSTANTS.MIN_ZOOM
      );
      state.viewport.scale = newScale;
      state.updatedAt = Date.now();
    },
    
    resetViewport: (state) => {
      state.viewport.scale = 1;
      state.viewport.panOffset = { x: 0, y: 0 };
      state.updatedAt = Date.now();
    },
    
    // Grid management
    setGrid: (state, action: PayloadAction<Partial<EnhancedWorkspaceState['grid']>>) => {
      state.grid = { ...state.grid, ...action.payload };
      state.updatedAt = Date.now();
    },
    
    toggleGrid: (state) => {
      state.grid.visible = !state.grid.visible;
      state.updatedAt = Date.now();
    },
    
    toggleSnapToGrid: (state) => {
      state.grid.snapToGrid = !state.grid.snapToGrid;
      state.updatedAt = Date.now();
    },
    
    setGridSize: (state, action: PayloadAction<number>) => {
      state.grid.size = Math.max(action.payload, 5);
      state.updatedAt = Date.now();
    },
    
    // UI management
    setUI: (state, action: PayloadAction<Partial<EnhancedWorkspaceState['ui']>>) => {
      state.ui = { ...state.ui, ...action.payload };
    },
    
    setSelectedTool: (state, action: PayloadAction<EnhancedWorkspaceState['ui']['selectedTool']>) => {
      state.ui.selectedTool = action.payload;
    },
    
    togglePanel: (state, action: PayloadAction<'miniMap' | 'properties' | 'layers' | 'nodePalette'>) => {
      const panel = action.payload;
      switch (panel) {
        case 'miniMap':
          state.ui.miniMapVisible = !state.ui.miniMapVisible;
          break;
        case 'properties':
          state.ui.propertiesPanelVisible = !state.ui.propertiesPanelVisible;
          break;
        case 'layers':
          state.ui.layersPanelVisible = !state.ui.layersPanelVisible;
          break;
        case 'nodePalette':
          state.ui.nodePaletteVisible = !state.ui.nodePaletteVisible;
          break;
      }
    },
    
    setContextMenu: (state, action: PayloadAction<Position | null>) => {
      state.ui.contextMenuPosition = action.payload;
    },
    
    setLoading: (state, action: PayloadAction<{ isLoading: boolean; message?: string }>) => {
      state.ui.isLoading = action.payload.isLoading;
      state.ui.loadingMessage = action.payload.message || null;
    },
    
    // Layer management
    addLayer: (state, action: PayloadAction<Omit<Layer, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const now = Date.now();
      const newLayer: Layer = {
        ...action.payload,
        id: `layer_${now}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: now,
        updatedAt: now,
      };
      state.layers[newLayer.id] = newLayer;
      state.updatedAt = now;
    },
    
    updateLayer: (state, action: PayloadAction<{ id: string; updates: Partial<Layer> }>) => {
      const { id, updates } = action.payload;
      if (state.layers[id]) {
        state.layers[id] = {
          ...state.layers[id],
          ...updates,
          updatedAt: Date.now(),
        };
        state.updatedAt = Date.now();
      }
    },
    
    removeLayer: (state, action: PayloadAction<string>) => {
      const layerId = action.payload;
      delete state.layers[layerId];
      state.selectedItems.layerIds = state.selectedItems.layerIds.filter(id => id !== layerId);
      state.updatedAt = Date.now();
    },
    
    // History management
    pushHistory: (state, action: PayloadAction<any>) => {
      state.history.past.push(action.payload);
      if (state.history.past.length > state.history.maxHistorySize) {
        state.history.past = state.history.past.slice(-state.history.maxHistorySize);
      }
      state.history.future = [];
      state.history.canUndo = state.history.past.length > 0;
      state.history.canRedo = false;
    },
    
    undo: (state) => {
      if (state.history.past.length > 0) {
        const previous = state.history.past.pop();
        if (previous) {
          state.history.future.unshift(previous);
          state.history.canRedo = true;
        }
        state.history.canUndo = state.history.past.length > 0;
      }
    },
    
    redo: (state) => {
      if (state.history.future.length > 0) {
        const next = state.history.future.shift();
        if (next) {
          state.history.past.push(next);
          state.history.canUndo = true;
        }
        state.history.canRedo = state.history.future.length > 0;
      }
    },
    
    clearHistory: (state) => {
      state.history.past = [];
      state.history.future = [];
      state.history.canUndo = false;
      state.history.canRedo = false;
    },
    
    // Performance management
    setPerformance: (state, action: PayloadAction<Partial<EnhancedWorkspaceState['performance']>>) => {
      state.performance = { ...state.performance, ...action.payload };
    },
    
    toggleLowPerformanceMode: (state) => {
      state.performance.lowPerformanceMode = !state.performance.lowPerformanceMode;
      
      // Automatically adjust settings for low performance mode
      if (state.performance.lowPerformanceMode) {
        state.performance.enableVirtualization = true;
        state.performance.renderOptimization = true;
        state.performance.maxVisibleNodes = 500;
        state.grid.visible = false;
      }
    },
    
    // File operations
    setFile: (state, action: PayloadAction<Partial<EnhancedWorkspaceState['file']>>) => {
      state.file = { ...state.file, ...action.payload };
      if (action.payload.name) {
        state.name = action.payload.name;
      }
      state.updatedAt = Date.now();
    },
    
    markDirty: (state) => {
      state.file.isDirty = true;
      state.updatedAt = Date.now();
    },
    
    markSaved: (state) => {
      state.file.isDirty = false;
      state.file.lastSaved = Date.now();
      state.updatedAt = Date.now();
    },
    
    // Architecture management
    setArchitecture: (state, action: PayloadAction<NetworkArchitecture>) => {
      state.architecture = action.payload;
      state.updatedAt = Date.now();
    },
    
    clearArchitecture: (state) => {
      state.architecture = null;
      state.updatedAt = Date.now();
    },
    
    // Workspace management
    setWorkspaceInfo: (state, action: PayloadAction<{ name?: string; description?: string }>) => {
      if (action.payload.name) state.name = action.payload.name;
      if (action.payload.description !== undefined) state.description = action.payload.description;
      state.updatedAt = Date.now();
    },
    
    resetWorkspace: () => ({
      ...initialState,
      id: `workspace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }),
    
    loadWorkspace: (state, action: PayloadAction<Partial<EnhancedWorkspaceState>>) => {
      return { ...state, ...action.payload, updatedAt: Date.now() };
    },
  }
});

export const {
  setViewport,
  setCanvasPosition,
  setCanvasScale,
  zoomIn,
  zoomOut,
  resetViewport,
  setGrid,
  toggleGrid,
  toggleSnapToGrid,
  setGridSize,
  setUI,
  setSelectedTool,
  togglePanel,
  setContextMenu,
  setLoading,
  addLayer,
  updateLayer,
  removeLayer,
  pushHistory,
  undo,
  redo,
  clearHistory,
  setPerformance,
  toggleLowPerformanceMode,
  setFile,
  markDirty,
  markSaved,
  setArchitecture,
  clearArchitecture,
  setWorkspaceInfo,
  resetWorkspace,
  loadWorkspace,
} = workspaceSlice.actions;

export type { EnhancedWorkspaceState };
export default workspaceSlice.reducer;