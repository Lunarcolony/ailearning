import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApplicationSettings, UIState } from '../../types';
import { 
  DEFAULT_CANVAS_CONFIG, 
  DEFAULT_NODE_CONFIG, 
  DEFAULT_CONNECTION_CONFIG,
  KEYBOARD_SHORTCUTS 
} from '../../constants';

interface EnhancedSettingsState extends ApplicationSettings {
  // User preferences
  user: {
    name: string;
    email: string;
    preferences: {
      language: 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja';
      timezone: string;
      notifications: boolean;
      analytics: boolean;
    };
  };
  
  // Theme and appearance
  theme: {
    mode: 'light' | 'dark' | 'auto';
    primaryColor: string;
    accentColor: string;
    fontFamily: string;
    fontSize: number;
    borderRadius: number;
    shadows: boolean;
    animations: boolean;
  };
  
  // Editor preferences
  editor: {
    autoSave: boolean;
    autoSaveInterval: number; // in milliseconds
    autoFormat: boolean;
    showLineNumbers: boolean;
    wordWrap: boolean;
    tabSize: number;
    insertSpaces: boolean;
    highlightActiveNode: boolean;
    showTooltips: boolean;
  };
  
  // Export/Import settings
  export: {
    defaultFormat: 'json' | 'onnx' | 'tensorflow' | 'pytorch';
    includeMetadata: boolean;
    compressOutput: boolean;
    validateBeforeExport: boolean;
    customFormats: Record<string, any>;
  };
  
  // Privacy and security
  privacy: {
    collectUsageData: boolean;
    shareErrorReports: boolean;
    allowTelemetry: boolean;
    dataRetention: number; // in days
  };
  
  // Advanced settings
  advanced: {
    debugMode: boolean;
    verboseLogging: boolean;
    experimentalFeatures: string[];
    customPlugins: string[];
    apiEndpoints: Record<string, string>;
  };
  
  // Recently used items
  recent: {
    workspaces: Array<{
      id: string;
      name: string;
      path: string;
      lastAccessed: number;
    }>;
    nodeTypes: string[];
    activationFunctions: string[];
  };
}

const initialState: EnhancedSettingsState = {
  // Canvas settings
  canvas: {
    gridSize: DEFAULT_CANVAS_CONFIG.gridSize,
    snapToGrid: DEFAULT_CANVAS_CONFIG.snapToGrid,
    showGrid: DEFAULT_CANVAS_CONFIG.showGrid,
    backgroundColor: DEFAULT_CANVAS_CONFIG.backgroundColor,
    defaultNodeSize: { width: 100, height: 60 },
    minZoom: DEFAULT_CANVAS_CONFIG.minZoom,
    maxZoom: DEFAULT_CANVAS_CONFIG.maxZoom,
  },
  
  // Node settings
  nodes: {
    defaultActivation: DEFAULT_NODE_CONFIG.activationFunction,
    defaultBias: DEFAULT_NODE_CONFIG.bias,
    autoConnect: false,
    showLabels: true,
    colorScheme: {
      input: '#10B981',
      hidden: '#3B82F6',
      output: '#EF4444',
      bias: '#8B5CF6',
      dropout: '#F59E0B',
      batchNorm: '#06B6D4',
      custom: '#6B7280',
    },
  },
  
  // Connection settings
  connections: {
    defaultWeight: DEFAULT_CONNECTION_CONFIG.weight,
    showWeights: true,
    connectionStyle: 'curved',
    animateConnections: false,
  },
  
  // Performance settings
  performance: {
    maxNodes: 1000,
    maxConnections: 5000,
    renderOptimization: true,
    virtualScrolling: false,
  },
  
  // Keyboard shortcuts
  shortcuts: KEYBOARD_SHORTCUTS,
  
  // Experimental features
  experimental: {
    features: [],
  },
  
  // User preferences
  user: {
    name: '',
    email: '',
    preferences: {
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      notifications: true,
      analytics: false,
    },
  },
  
  // Theme settings
  theme: {
    mode: 'light',
    primaryColor: '#3B82F6',
    accentColor: '#10B981',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: 14,
    borderRadius: 6,
    shadows: true,
    animations: true,
  },
  
  // Editor settings
  editor: {
    autoSave: true,
    autoSaveInterval: 30000, // 30 seconds
    autoFormat: true,
    showLineNumbers: false,
    wordWrap: true,
    tabSize: 2,
    insertSpaces: true,
    highlightActiveNode: true,
    showTooltips: true,
  },
  
  // Export settings
  export: {
    defaultFormat: 'json',
    includeMetadata: true,
    compressOutput: false,
    validateBeforeExport: true,
    customFormats: {},
  },
  
  // Privacy settings
  privacy: {
    collectUsageData: false,
    shareErrorReports: true,
    allowTelemetry: false,
    dataRetention: 30,
  },
  
  // Advanced settings
  advanced: {
    debugMode: false,
    verboseLogging: false,
    experimentalFeatures: [],
    customPlugins: [],
    apiEndpoints: {},
  },
  
  // Recent items
  recent: {
    workspaces: [],
    nodeTypes: ['input', 'hidden', 'output'],
    activationFunctions: ['relu', 'sigmoid', 'tanh'],
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // Canvas settings
    updateCanvasSettings: (state, action: PayloadAction<Partial<EnhancedSettingsState['canvas']>>) => {
      state.canvas = { ...state.canvas, ...action.payload };
    },
    
    // Node settings
    updateNodeSettings: (state, action: PayloadAction<Partial<EnhancedSettingsState['nodes']>>) => {
      state.nodes = { ...state.nodes, ...action.payload };
    },
    
    updateNodeColorScheme: (state, action: PayloadAction<Partial<EnhancedSettingsState['nodes']['colorScheme']>>) => {
      state.nodes.colorScheme = { ...state.nodes.colorScheme, ...action.payload };
    },
    
    // Connection settings
    updateConnectionSettings: (state, action: PayloadAction<Partial<EnhancedSettingsState['connections']>>) => {
      state.connections = { ...state.connections, ...action.payload };
    },
    
    // Performance settings
    updatePerformanceSettings: (state, action: PayloadAction<Partial<EnhancedSettingsState['performance']>>) => {
      state.performance = { ...state.performance, ...action.payload };
    },
    
    // Theme settings
    updateTheme: (state, action: PayloadAction<Partial<EnhancedSettingsState['theme']>>) => {
      state.theme = { ...state.theme, ...action.payload };
    },
    
    setThemeMode: (state, action: PayloadAction<'light' | 'dark' | 'auto'>) => {
      state.theme.mode = action.payload;
    },
    
    // User settings
    updateUserSettings: (state, action: PayloadAction<Partial<EnhancedSettingsState['user']>>) => {
      state.user = { ...state.user, ...action.payload };
    },
    
    updateUserPreferences: (state, action: PayloadAction<Partial<EnhancedSettingsState['user']['preferences']>>) => {
      state.user.preferences = { ...state.user.preferences, ...action.payload };
    },
    
    // Editor settings
    updateEditorSettings: (state, action: PayloadAction<Partial<EnhancedSettingsState['editor']>>) => {
      state.editor = { ...state.editor, ...action.payload };
    },
    
    // Export settings
    updateExportSettings: (state, action: PayloadAction<Partial<EnhancedSettingsState['export']>>) => {
      state.export = { ...state.export, ...action.payload };
    },
    
    addCustomExportFormat: (state, action: PayloadAction<{ name: string; config: any }>) => {
      state.export.customFormats[action.payload.name] = action.payload.config;
    },
    
    removeCustomExportFormat: (state, action: PayloadAction<string>) => {
      delete state.export.customFormats[action.payload];
    },
    
    // Privacy settings
    updatePrivacySettings: (state, action: PayloadAction<Partial<EnhancedSettingsState['privacy']>>) => {
      state.privacy = { ...state.privacy, ...action.payload };
    },
    
    // Advanced settings
    updateAdvancedSettings: (state, action: PayloadAction<Partial<EnhancedSettingsState['advanced']>>) => {
      state.advanced = { ...state.advanced, ...action.payload };
    },
    
    toggleExperimentalFeature: (state, action: PayloadAction<string>) => {
      const feature = action.payload;
      const index = state.advanced.experimentalFeatures.indexOf(feature);
      if (index >= 0) {
        state.advanced.experimentalFeatures.splice(index, 1);
      } else {
        state.advanced.experimentalFeatures.push(feature);
      }
    },
    
    addCustomPlugin: (state, action: PayloadAction<string>) => {
      if (!state.advanced.customPlugins.includes(action.payload)) {
        state.advanced.customPlugins.push(action.payload);
      }
    },
    
    removeCustomPlugin: (state, action: PayloadAction<string>) => {
      state.advanced.customPlugins = state.advanced.customPlugins.filter(
        plugin => plugin !== action.payload
      );
    },
    
    // Keyboard shortcuts
    updateShortcuts: (state, action: PayloadAction<Partial<typeof KEYBOARD_SHORTCUTS>>) => {
      state.shortcuts = { ...state.shortcuts, ...action.payload };
    },
    
    resetShortcuts: (state) => {
      state.shortcuts = KEYBOARD_SHORTCUTS;
    },
    
    // Recent items
    addRecentWorkspace: (state, action: PayloadAction<{ id: string; name: string; path: string }>) => {
      const workspace = {
        ...action.payload,
        lastAccessed: Date.now(),
      };
      
      // Remove existing entry if it exists
      state.recent.workspaces = state.recent.workspaces.filter(w => w.id !== workspace.id);
      
      // Add to beginning
      state.recent.workspaces.unshift(workspace);
      
      // Keep only last 10
      state.recent.workspaces = state.recent.workspaces.slice(0, 10);
    },
    
    removeRecentWorkspace: (state, action: PayloadAction<string>) => {
      state.recent.workspaces = state.recent.workspaces.filter(w => w.id !== action.payload);
    },
    
    clearRecentWorkspaces: (state) => {
      state.recent.workspaces = [];
    },
    
    addRecentNodeType: (state, action: PayloadAction<string>) => {
      const nodeType = action.payload;
      state.recent.nodeTypes = state.recent.nodeTypes.filter(type => type !== nodeType);
      state.recent.nodeTypes.unshift(nodeType);
      state.recent.nodeTypes = state.recent.nodeTypes.slice(0, 5);
    },
    
    addRecentActivationFunction: (state, action: PayloadAction<string>) => {
      const activation = action.payload;
      state.recent.activationFunctions = state.recent.activationFunctions.filter(fn => fn !== activation);
      state.recent.activationFunctions.unshift(activation);
      state.recent.activationFunctions = state.recent.activationFunctions.slice(0, 5);
    },
    
    // Bulk operations
    importSettings: (state, action: PayloadAction<Partial<EnhancedSettingsState>>) => {
      return { ...state, ...action.payload };
    },
    
    exportSettings: (state) => state,
    
    resetSettings: () => initialState,
    
    resetToDefaults: (state, action: PayloadAction<keyof EnhancedSettingsState>) => {
      const section = action.payload;
      switch (section) {
        case 'canvas':
          state.canvas = initialState.canvas;
          break;
        case 'nodes':
          state.nodes = initialState.nodes;
          break;
        case 'connections':
          state.connections = initialState.connections;
          break;
        case 'theme':
          state.theme = initialState.theme;
          break;
        case 'editor':
          state.editor = initialState.editor;
          break;
        case 'performance':
          state.performance = initialState.performance;
          break;
        default:
          break;
      }
    },
  },
});

export const {
  updateCanvasSettings,
  updateNodeSettings,
  updateNodeColorScheme,
  updateConnectionSettings,
  updatePerformanceSettings,
  updateTheme,
  setThemeMode,
  updateUserSettings,
  updateUserPreferences,
  updateEditorSettings,
  updateExportSettings,
  addCustomExportFormat,
  removeCustomExportFormat,
  updatePrivacySettings,
  updateAdvancedSettings,
  toggleExperimentalFeature,
  addCustomPlugin,
  removeCustomPlugin,
  updateShortcuts,
  resetShortcuts,
  addRecentWorkspace,
  removeRecentWorkspace,
  clearRecentWorkspaces,
  addRecentNodeType,
  addRecentActivationFunction,
  importSettings,
  exportSettings,
  resetSettings,
  resetToDefaults,
} = settingsSlice.actions;

export type { EnhancedSettingsState };
export default settingsSlice.reducer;