import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  theme: 'light' | 'dark';
  language: string;
  autoSave: boolean;
  autoSaveInterval: number;
  gridSettings: {
    visible: boolean;
    size: number;
    color: string;
  };
  codeExport: {
    framework: 'tensorflow' | 'pytorch' | 'numpy';
    format: 'script' | 'notebook';
    includeComments: boolean;
    includeTraining: boolean;
  };
  ui: {
    sidebarCollapsed: boolean;
    propertiesPanelCollapsed: boolean;
    minimapVisible: boolean;
  };
}

const initialState: SettingsState = {
  theme: 'light',
  language: 'en',
  autoSave: true,
  autoSaveInterval: 30000, // 30 seconds
  gridSettings: {
    visible: true,
    size: 20,
    color: '#e5e5e5'
  },
  codeExport: {
    framework: 'tensorflow',
    format: 'script',
    includeComments: true,
    includeTraining: true
  },
  ui: {
    sidebarCollapsed: false,
    propertiesPanelCollapsed: false,
    minimapVisible: true
  }
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    toggleAutoSave: (state) => {
      state.autoSave = !state.autoSave;
    },
    setAutoSaveInterval: (state, action: PayloadAction<number>) => {
      state.autoSaveInterval = action.payload;
    },
    updateGridSettings: (state, action: PayloadAction<Partial<SettingsState['gridSettings']>>) => {
      state.gridSettings = { ...state.gridSettings, ...action.payload };
    },
    updateCodeExportSettings: (state, action: PayloadAction<Partial<SettingsState['codeExport']>>) => {
      state.codeExport = { ...state.codeExport, ...action.payload };
    },
    toggleSidebar: (state) => {
      state.ui.sidebarCollapsed = !state.ui.sidebarCollapsed;
    },
    togglePropertiesPanel: (state) => {
      state.ui.propertiesPanelCollapsed = !state.ui.propertiesPanelCollapsed;
    },
    toggleMinimap: (state) => {
      state.ui.minimapVisible = !state.ui.minimapVisible;
    },
    resetSettings: () => {
      return initialState;
    }
  }
});

export const {
  setTheme,
  setLanguage,
  toggleAutoSave,
  setAutoSaveInterval,
  updateGridSettings,
  updateCodeExportSettings,
  toggleSidebar,
  togglePropertiesPanel,
  toggleMinimap,
  resetSettings
} = settingsSlice.actions;

export default settingsSlice.reducer;