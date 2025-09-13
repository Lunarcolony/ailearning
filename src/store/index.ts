import { configureStore } from '@reduxjs/toolkit';
import workspaceReducer from './slices/workspaceSlice';
import nodesReducer from './slices/nodesSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    workspace: workspaceReducer,
    nodes: nodesReducer,
    settings: settingsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;