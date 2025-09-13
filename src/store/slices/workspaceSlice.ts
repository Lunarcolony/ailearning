import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WorkspaceState {
  canvasPosition: { x: number; y: number };
  canvasScale: number;
  gridVisible: boolean;
  snapToGrid: boolean;
  gridSize: number;
  isLoading: boolean;
  selectedTool: string | null;
}

const initialState: WorkspaceState = {
  canvasPosition: { x: 0, y: 0 },
  canvasScale: 1,
  gridVisible: true,
  snapToGrid: true,
  gridSize: 20,
  isLoading: false,
  selectedTool: null
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setCanvasPosition: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.canvasPosition = action.payload;
    },
    setCanvasScale: (state, action: PayloadAction<number>) => {
      state.canvasScale = Math.min(Math.max(action.payload, 0.1), 5);
    },
    toggleGrid: (state) => {
      state.gridVisible = !state.gridVisible;
    },
    toggleSnapToGrid: (state) => {
      state.snapToGrid = !state.snapToGrid;
    },
    setGridSize: (state, action: PayloadAction<number>) => {
      state.gridSize = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSelectedTool: (state, action: PayloadAction<string | null>) => {
      state.selectedTool = action.payload;
    },
    resetWorkspace: () => {
      return initialState;
    }
  }
});

export const {
  setCanvasPosition,
  setCanvasScale,
  toggleGrid,
  toggleSnapToGrid,
  setGridSize,
  setLoading,
  setSelectedTool,
  resetWorkspace
} = workspaceSlice.actions;

export default workspaceSlice.reducer;