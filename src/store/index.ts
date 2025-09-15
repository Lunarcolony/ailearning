import { configureStore, Middleware } from '@reduxjs/toolkit';

// Import enhanced reducers
import nodesReducer from './slices/nodesSlice';
import workspaceReducer from './slices/workspaceSlice.enhanced';
import settingsReducer from './slices/settingsSlice.enhanced';

// Performance monitoring middleware
const performanceMiddleware: Middleware = () => (next) => (action: any) => {
  const isDevelopment = true; // For now, always enable in development
  
  if (isDevelopment) {
    const start = performance.now();
    const result = next(action);
    const end = performance.now();
    
    if (end - start > 16) { // Log slow actions (>16ms)
      console.warn(`Slow action: ${action.type} took ${end - start}ms`);
    }
    
    return result;
  }
  return next(action);
};

export const store = configureStore({
  reducer: {
    nodes: nodesReducer,
    workspace: workspaceReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        ignoredPaths: ['items.dates'],
      },
      immutableCheck: {
        ignoredPaths: ['nodes.entities', 'connections.entities'],
      },
    }).concat(performanceMiddleware),
  devTools: {
    maxAge: 100,
    trace: true,
    traceLimit: 25,
    name: 'Neural Network Designer',
  },
});

// Inferred types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Type-safe hooks
export type AppStore = typeof store;

// Selector type helpers
export type NodesState = RootState['nodes'];
export type WorkspaceState = RootState['workspace'];
export type SettingsState = RootState['settings'];

// Action creators type
export type AppActions = Parameters<AppDispatch>[0];

// Async thunk types
export type AppThunk<ReturnType = void> = (
  dispatch: AppDispatch,
  getState: () => RootState
) => ReturnType;