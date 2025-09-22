// Core Types
export interface Position {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface BoundingBox extends Position, Dimensions {}

// Node Types
export type NodeType = 
  | 'input'
  | 'hidden'
  | 'output'
  | 'bias'
  | 'dropout'
  | 'batchNorm'
  | 'custom';

export type ActivationFunction = 
  | 'relu'
  | 'leakyRelu'
  | 'elu'
  | 'sigmoid'
  | 'tanh'
  | 'softmax'
  | 'linear'
  | 'swish'
  | 'gelu'
  | 'mish'
  | 'custom';

export interface NodeConfiguration {
  activationFunction: ActivationFunction;
  bias: boolean;
  learningRate?: number;
  dropoutRate?: number;
  regularization?: {
    type: 'l1' | 'l2' | 'elastic';
    strength: number;
  };
  customParams?: Record<string, any>;
}

export interface NodeData {
  id: string;
  type: NodeType;
  label: string;
  position: Position;
  dimensions: Dimensions;
  configuration: NodeConfiguration;
  layerId?: string;
  selected: boolean;
  color?: string;
  metadata?: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

// Connection Types
export type ConnectionType = 
  | 'standard'
  | 'convolutional'
  | 'recurrent'
  | 'skip'
  | 'attention';

export interface ConnectionConfiguration {
  weight: number;
  learnable: boolean;
  constraints?: {
    min?: number;
    max?: number;
  };
  regularization?: {
    type: 'l1' | 'l2';
    strength: number;
  };
}

export interface Connection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourceHandle?: string;
  targetHandle?: string;
  type: ConnectionType;
  configuration: ConnectionConfiguration;
  selected: boolean;
  metadata?: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

// Layer Types
export interface Layer {
  id: string;
  name: string;
  type: 'input' | 'hidden' | 'output' | 'custom';
  nodeIds: string[];
  position: number; // Order in the network
  configuration?: Record<string, any>;
  // Visual properties for translucent boxes
  visual?: {
    position: Position;
    dimensions: Dimensions;
    color: string;
    opacity: number;
    visible: boolean;
    zIndex: number;
  };
  createdAt: number;
  updatedAt: number;
}

// Network Architecture Types
export interface NetworkArchitecture {
  id: string;
  name: string;
  description?: string;
  type: 'feedforward' | 'cnn' | 'rnn' | 'lstm' | 'gru' | 'autoencoder' | 'gan' | 'custom';
  layers: Layer[];
  globalConfiguration?: Record<string, any>;
  metadata?: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

// Workspace Types
export interface WorkspaceState {
  id: string;
  name: string;
  description?: string;
  nodes: Record<string, NodeData>;
  connections: Record<string, Connection>;
  layers: Record<string, Layer>;
  selectedItems: {
    nodeIds: string[];
    connectionIds: string[];
    layerIds: string[];
  };
  clipboard: {
    nodes: NodeData[];
    connections: Connection[];
  };
  viewport: {
    scale: number;
    panOffset: Position;
  };
  grid: {
    enabled: boolean;
    size: number;
    snapToGrid: boolean;
  };
  history: {
    past: any[];
    future: any[];
    maxHistorySize: number;
  };
  metadata?: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

// UI State Types
export interface UIState {
  theme: 'light' | 'dark' | 'auto';
  sidebar: {
    isOpen: boolean;
    activePanel: 'palette' | 'properties' | 'layers' | null;
    width: number;
  };
  contextMenu: {
    isOpen: boolean;
    position: Position;
    targetId: string | null;
    targetType: 'node' | 'connection' | 'canvas' | null;
  };
  modals: {
    settings: boolean;
    nodeProperties: boolean;
    networkExport: boolean;
    networkImport: boolean;
  };
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: number;
    autoHide: boolean;
  }>;
  loading: {
    global: boolean;
    operations: Record<string, boolean>;
  };
  errors: {
    global: string | null;
    field: Record<string, string>;
  };
}

// Application Settings Types
export interface ApplicationSettings {
  canvas: {
    gridSize: number;
    snapToGrid: boolean;
    showGrid: boolean;
    backgroundColor: string;
    defaultNodeSize: Dimensions;
    minZoom: number;
    maxZoom: number;
  };
  nodes: {
    defaultActivation: ActivationFunction;
    defaultBias: boolean;
    autoConnect: boolean;
    showLabels: boolean;
    colorScheme: Record<NodeType, string>;
  };
  connections: {
    defaultWeight: number;
    showWeights: boolean;
    connectionStyle: 'curved' | 'straight' | 'orthogonal';
    animateConnections: boolean;
  };
  performance: {
    maxNodes: number;
    maxConnections: number;
    renderOptimization: boolean;
    virtualScrolling: boolean;
  };
  shortcuts: Record<string, string>;
  experimental: {
    features: string[];
  };
}

// Event Types
export interface CanvasEvent {
  type: string;
  position: Position;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  timestamp: number;
}

export interface NodeEvent extends CanvasEvent {
  nodeId: string;
  node: NodeData;
}

export interface ConnectionEvent extends CanvasEvent {
  connectionId: string;
  connection: Connection;
}

// API Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

export interface NetworkExportFormat {
  format: 'json' | 'onnx' | 'tensorflow' | 'pytorch';
  workspace: WorkspaceState;
  metadata: Record<string, any>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Array<{
    type: 'error' | 'warning';
    message: string;
    nodeId?: string;
    connectionId?: string;
  }>;
  suggestions?: string[];
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Nullable<T> = T | null;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Hook Types
export interface UseNodesReturn {
  nodes: NodeData[];
  selectedNodes: NodeData[];
  addNode: (node: Omit<NodeData, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNode: (id: string, updates: Partial<NodeData>) => void;
  removeNode: (id: string) => void;
  selectNode: (id: string, addToSelection?: boolean) => void;
  deselectNode: (id: string) => void;
  clearSelection: () => void;
  duplicateNode: (id: string) => void;
  moveNode: (id: string, position: Position) => void;
}

export interface UseConnectionsReturn {
  connections: Connection[];
  selectedConnections: Connection[];
  addConnection: (connection: Omit<Connection, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateConnection: (id: string, updates: Partial<Connection>) => void;
  removeConnection: (id: string) => void;
  selectConnection: (id: string, addToSelection?: boolean) => void;
  deselectConnection: (id: string) => void;
  getNodeConnections: (nodeId: string) => Connection[];
  validateConnection: (sourceId: string, targetId: string) => ValidationResult;
}

export interface UseLayersReturn {
  layers: Layer[];
  selectedLayers: Layer[];
  addLayer: (layer: Omit<Layer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLayer: (id: string, updates: Partial<Layer>) => void;
  removeLayer: (id: string) => void;
  selectLayer: (id: string, addToSelection?: boolean) => void;
  deselectLayer: (id: string) => void;
  clearSelection: () => void;
  moveLayer: (id: string, position: Position) => void;
  resizeLayer: (id: string, dimensions: Dimensions) => void;
  toggleLayerVisibility: (id: string) => void;
  assignNodeToLayer: (nodeId: string, layerId: string) => void;
  removeNodeFromLayer: (nodeId: string, layerId: string) => void;
}