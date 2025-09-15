import { NodeType, ActivationFunction, ConnectionType } from '../types';

// Node type definitions with metadata
export const NODE_TYPES = {
  input: {
    label: 'Input',
    color: '#10B981',
    category: 'data',
    description: 'Input layer neuron for receiving data',
    allowedConnections: { outgoing: true, incoming: false },
    defaultSize: { width: 100, height: 60 }
  },
  hidden: {
    label: 'Hidden',
    color: '#3B82F6',
    category: 'processing',
    description: 'Hidden layer neuron for data processing',
    allowedConnections: { outgoing: true, incoming: true },
    defaultSize: { width: 100, height: 60 }
  },
  output: {
    label: 'Output',
    color: '#EF4444',
    category: 'data',
    description: 'Output layer neuron for final predictions',
    allowedConnections: { outgoing: false, incoming: true },
    defaultSize: { width: 100, height: 60 }
  },
  bias: {
    label: 'Bias',
    color: '#8B5CF6',
    category: 'special',
    description: 'Bias neuron providing constant input',
    allowedConnections: { outgoing: true, incoming: false },
    defaultSize: { width: 80, height: 80 }
  },
  dropout: {
    label: 'Dropout',
    color: '#F59E0B',
    category: 'regularization',
    description: 'Dropout layer for regularization',
    allowedConnections: { outgoing: true, incoming: true },
    defaultSize: { width: 120, height: 60 }
  },
  batchNorm: {
    label: 'Batch Norm',
    color: '#06B6D4',
    category: 'normalization',
    description: 'Batch normalization layer',
    allowedConnections: { outgoing: true, incoming: true },
    defaultSize: { width: 120, height: 60 }
  },
  custom: {
    label: 'Custom',
    color: '#6B7280',
    category: 'custom',
    description: 'Custom neuron type',
    allowedConnections: { outgoing: true, incoming: true },
    defaultSize: { width: 100, height: 60 }
  }
} as const;

// Activation function definitions
export const ACTIVATION_FUNCTIONS = {
  relu: {
    label: 'ReLU',
    formula: 'max(0, x)',
    description: 'Rectified Linear Unit - most common activation',
    range: '[0, ∞)',
    derivative: 'x > 0 ? 1 : 0'
  },
  leakyRelu: {
    label: 'Leaky ReLU',
    formula: 'x > 0 ? x : 0.01x',
    description: 'Leaky ReLU with small negative slope',
    range: '(-∞, ∞)',
    derivative: 'x > 0 ? 1 : 0.01'
  },
  elu: {
    label: 'ELU',
    formula: 'x > 0 ? x : α(e^x - 1)',
    description: 'Exponential Linear Unit',
    range: '(-α, ∞)',
    derivative: 'x > 0 ? 1 : f(x) + α'
  },
  sigmoid: {
    label: 'Sigmoid',
    formula: '1 / (1 + e^(-x))',
    description: 'Sigmoid function - smooth S-curve',
    range: '(0, 1)',
    derivative: 'f(x) * (1 - f(x))'
  },
  tanh: {
    label: 'Tanh',
    formula: '(e^x - e^(-x)) / (e^x + e^(-x))',
    description: 'Hyperbolic tangent - zero-centered',
    range: '(-1, 1)',
    derivative: '1 - f(x)²'
  },
  softmax: {
    label: 'Softmax',
    formula: 'e^xi / Σe^xj',
    description: 'Softmax - probability distribution',
    range: '(0, 1)',
    derivative: 'f(x) * (1 - f(x))'
  },
  linear: {
    label: 'Linear',
    formula: 'x',
    description: 'Linear activation - no transformation',
    range: '(-∞, ∞)',
    derivative: '1'
  },
  swish: {
    label: 'Swish',
    formula: 'x * sigmoid(x)',
    description: 'Swish activation - smooth and non-monotonic',
    range: '(-∞, ∞)',
    derivative: 'f(x) + sigmoid(x) * (1 - f(x))'
  },
  gelu: {
    label: 'GELU',
    formula: '0.5x(1 + tanh(√(2/π)(x + 0.044715x³)))',
    description: 'Gaussian Error Linear Unit',
    range: '(-∞, ∞)',
    derivative: 'Complex - see documentation'
  },
  mish: {
    label: 'Mish',
    formula: 'x * tanh(softplus(x))',
    description: 'Mish activation - smooth and non-monotonic',
    range: '(-∞, ∞)',
    derivative: 'Complex - see documentation'
  },
  custom: {
    label: 'Custom',
    formula: 'User-defined',
    description: 'Custom activation function',
    range: 'Variable',
    derivative: 'User-defined'
  }
} as const;

// Connection type definitions
export const CONNECTION_TYPES = {
  standard: {
    label: 'Standard',
    description: 'Standard weighted connection',
    color: '#374151',
    style: 'solid'
  },
  convolutional: {
    label: 'Convolutional',
    description: 'Convolutional layer connection',
    color: '#059669',
    style: 'dashed'
  },
  recurrent: {
    label: 'Recurrent',
    description: 'Recurrent connection for RNNs',
    color: '#DC2626',
    style: 'curved'
  },
  skip: {
    label: 'Skip',
    description: 'Skip connection for residual networks',
    color: '#7C3AED',
    style: 'dotted'
  },
  attention: {
    label: 'Attention',
    description: 'Attention mechanism connection',
    color: '#EA580C',
    style: 'wavy'
  }
} as const;

// Canvas constants
export const CANVAS_CONSTANTS = {
  GRID_SIZE: 20,
  MIN_ZOOM: 0.1,
  MAX_ZOOM: 3.0,
  ZOOM_STEP: 0.1,
  PAN_SENSITIVITY: 1,
  SELECTION_THRESHOLD: 5,
  SNAP_THRESHOLD: 10,
  CONNECTION_HOVER_DISTANCE: 8,
  NODE_MIN_SIZE: { width: 60, height: 40 },
  NODE_MAX_SIZE: { width: 300, height: 200 },
  DEFAULT_NODE_SIZE: { width: 100, height: 60 },
  CONNECTION_CONTROL_POINT_DISTANCE: 100,
  ANIMATION_DURATION: 200
} as const;

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  // Selection
  SELECT_ALL: 'ctrl+a',
  DESELECT_ALL: 'escape',
  
  // Editing
  DELETE: 'delete',
  COPY: 'ctrl+c',
  PASTE: 'ctrl+v',
  CUT: 'ctrl+x',
  UNDO: 'ctrl+z',
  REDO: 'ctrl+y',
  DUPLICATE: 'ctrl+d',
  
  // Navigation
  ZOOM_IN: 'ctrl+=',
  ZOOM_OUT: 'ctrl+-',
  ZOOM_FIT: 'ctrl+0',
  ZOOM_RESET: 'ctrl+1',
  
  // Tools
  PAN_MODE: 'space',
  CONNECTION_MODE: 'c',
  SELECTION_MODE: 'v',
  
  // Nodes
  ADD_INPUT_NODE: '1',
  ADD_HIDDEN_NODE: '2',
  ADD_OUTPUT_NODE: '3',
  ADD_BIAS_NODE: '4',
  
  // Panels
  TOGGLE_SIDEBAR: 'ctrl+b',
  TOGGLE_PROPERTIES: 'ctrl+p',
  TOGGLE_LAYERS: 'ctrl+l',
  
  // Other
  SAVE: 'ctrl+s',
  OPEN: 'ctrl+o',
  NEW: 'ctrl+n',
  EXPORT: 'ctrl+e'
} as const;

// Validation rules
export const VALIDATION_RULES = {
  NODE_LABEL_MAX_LENGTH: 50,
  NODE_LABEL_MIN_LENGTH: 1,
  MAX_NODES_PER_WORKSPACE: 1000,
  MAX_CONNECTIONS_PER_WORKSPACE: 5000,
  MAX_LAYERS: 100,
  MIN_WEIGHT: -1000,
  MAX_WEIGHT: 1000,
  MIN_LEARNING_RATE: 0.0001,
  MAX_LEARNING_RATE: 1,
  MIN_DROPOUT_RATE: 0,
  MAX_DROPOUT_RATE: 1,
  WORKSPACE_NAME_MAX_LENGTH: 100,
  WORKSPACE_NAME_MIN_LENGTH: 1
} as const;

// Performance thresholds
export const PERFORMANCE_THRESHOLDS = {
  LARGE_WORKSPACE_NODE_COUNT: 100,
  LARGE_WORKSPACE_CONNECTION_COUNT: 500,
  RENDER_OPTIMIZATION_THRESHOLD: 200,
  VIRTUAL_SCROLLING_THRESHOLD: 1000,
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 100
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NODE_NOT_FOUND: 'Node not found',
  CONNECTION_NOT_FOUND: 'Connection not found',
  INVALID_CONNECTION: 'Invalid connection',
  CIRCULAR_CONNECTION: 'Circular connection detected',
  DUPLICATE_CONNECTION: 'Connection already exists',
  MAX_NODES_EXCEEDED: `Maximum of ${VALIDATION_RULES.MAX_NODES_PER_WORKSPACE} nodes allowed`,
  MAX_CONNECTIONS_EXCEEDED: `Maximum of ${VALIDATION_RULES.MAX_CONNECTIONS_PER_WORKSPACE} connections allowed`,
  INVALID_NODE_TYPE: 'Invalid node type',
  INVALID_ACTIVATION_FUNCTION: 'Invalid activation function',
  NETWORK_SAVE_FAILED: 'Failed to save network',
  NETWORK_LOAD_FAILED: 'Failed to load network',
  EXPORT_FAILED: 'Failed to export network',
  IMPORT_FAILED: 'Failed to import network'
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  NODE_ADDED: 'Node added successfully',
  NODE_UPDATED: 'Node updated successfully',
  NODE_DELETED: 'Node deleted successfully',
  CONNECTION_ADDED: 'Connection added successfully',
  CONNECTION_UPDATED: 'Connection updated successfully',
  CONNECTION_DELETED: 'Connection deleted successfully',
  NETWORK_SAVED: 'Network saved successfully',
  NETWORK_LOADED: 'Network loaded successfully',
  NETWORK_EXPORTED: 'Network exported successfully',
  NETWORK_IMPORTED: 'Network imported successfully'
} as const;

// Default configurations
export const DEFAULT_NODE_CONFIG = {
  activationFunction: 'relu' as ActivationFunction,
  bias: true,
  learningRate: 0.001,
  dropoutRate: 0.0
} as const;

export const DEFAULT_CONNECTION_CONFIG = {
  weight: 0.5,
  learnable: true
} as const;

export const DEFAULT_CANVAS_CONFIG = {
  gridSize: CANVAS_CONSTANTS.GRID_SIZE,
  snapToGrid: true,
  showGrid: true,
  backgroundColor: '#f8fafc',
  minZoom: CANVAS_CONSTANTS.MIN_ZOOM,
  maxZoom: CANVAS_CONSTANTS.MAX_ZOOM
} as const;

// Type guards
export const isNodeType = (value: string): value is NodeType => {
  return Object.keys(NODE_TYPES).includes(value as NodeType);
};

export const isActivationFunction = (value: string): value is ActivationFunction => {
  return Object.keys(ACTIVATION_FUNCTIONS).includes(value as ActivationFunction);
};

export const isConnectionType = (value: string): value is ConnectionType => {
  return Object.keys(CONNECTION_TYPES).includes(value as ConnectionType);
};