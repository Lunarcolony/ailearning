import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux';
import { useMemo, useCallback } from 'react';
import type { RootState, AppDispatch } from '../store';
import { NodeData, Connection, Position } from '../types';
import { 
  selectNode, 
  deselectNode, 
  addNode, 
  updateNode, 
  removeNode, 
  moveNode,
  addConnection,
  updateConnection,
  removeConnection
} from '../store/slices/nodesSlice';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Enhanced hooks with memoization and optimized selectors
export const useNodes = () => {
  const dispatch = useAppDispatch();
  const nodesState = useAppSelector(state => state.nodes);
  
  const nodes = useMemo(() => 
    Object.values(nodesState.nodes.entities).filter((node): node is NodeData => node !== undefined),
    [nodesState.nodes.entities]
  );
  
  const selectedNodes = useMemo(() => 
    nodesState.selectedNodeIds
      .map(id => nodesState.nodes.entities[id])
      .filter((node): node is NodeData => node !== undefined),
    [nodesState.selectedNodeIds, nodesState.nodes.entities]
  );
  
  const actions = useMemo(() => ({
    addNode: useCallback((nodeData: Omit<NodeData, 'id' | 'createdAt' | 'updatedAt'>) => {
      dispatch(addNode(nodeData));
    }, [dispatch]),
    
    updateNode: useCallback((id: string, updates: Partial<NodeData>) => {
      dispatch(updateNode({ id, updates }));
    }, [dispatch]),
    
    removeNode: useCallback((id: string) => {
      dispatch(removeNode(id));
    }, [dispatch]),
    
    moveNode: useCallback((id: string, position: Position) => {
      dispatch(moveNode({ id, position }));
    }, [dispatch]),
    
    selectNode: useCallback((id: string, addToSelection = false) => {
      dispatch(selectNode({ id, addToSelection }));
    }, [dispatch]),
    
    deselectNode: useCallback((id: string) => {
      dispatch(deselectNode(id));
    }, [dispatch]),
  }), [dispatch]);
  
  return {
    nodes,
    selectedNodes,
    selectedNodeIds: nodesState.selectedNodeIds,
    draggedNodeId: nodesState.draggedNodeId,
    isLoading: nodesState.isLoading,
    error: nodesState.error,
    ...actions
  };
};

export const useConnections = () => {
  const dispatch = useAppDispatch();
  const connectionsState = useAppSelector(state => state.nodes.connections);
  const selectedConnectionIds = useAppSelector(state => state.nodes.selectedConnectionIds);
  
  const connections = useMemo(() => 
    Object.values(connectionsState.entities).filter((conn): conn is Connection => conn !== undefined),
    [connectionsState.entities]
  );
  
  const selectedConnections = useMemo(() => 
    selectedConnectionIds
      .map(id => connectionsState.entities[id])
      .filter((conn): conn is Connection => conn !== undefined),
    [selectedConnectionIds, connectionsState.entities]
  );
  
  const getNodeConnections = useCallback((nodeId: string) => {
    return connections.filter(conn => 
      conn.sourceNodeId === nodeId || conn.targetNodeId === nodeId
    );
  }, [connections]);
  
  const actions = useMemo(() => ({
    addConnection: useCallback((connectionData: Omit<Connection, 'id' | 'createdAt' | 'updatedAt'>) => {
      dispatch(addConnection(connectionData));
    }, [dispatch]),
    
    updateConnection: useCallback((id: string, updates: Partial<Connection>) => {
      dispatch(updateConnection({ id, updates }));
    }, [dispatch]),
    
    removeConnection: useCallback((id: string) => {
      dispatch(removeConnection(id));
    }, [dispatch]),
  }), [dispatch]);
  
  return {
    connections,
    selectedConnections,
    selectedConnectionIds,
    getNodeConnections,
    ...actions
  };
};

export const useWorkspace = () => {
  const workspace = useAppSelector(state => state.workspace);
  const dispatch = useAppDispatch();
  
  return {
    ...workspace,
    dispatch
  };
};

export const useSettings = () => {
  const settings = useAppSelector(state => state.settings);
  const dispatch = useAppDispatch();
  
  return {
    ...settings,
    dispatch
  };
};

// Performance-optimized selector hooks
export const useSelectedNodeCount = () => 
  useAppSelector(state => state.nodes.selectedNodeIds.length);

export const useNodeCount = () => 
  useAppSelector(state => Object.keys(state.nodes.nodes.entities).length);

export const useConnectionCount = () => 
  useAppSelector(state => Object.keys(state.nodes.connections.entities).length);

export const useCanvasScale = () => 
  useAppSelector(state => state.workspace.viewport.scale);

export const useCanvasPosition = () => 
  useAppSelector(state => state.workspace.viewport.panOffset);

export const useTheme = () => 
  useAppSelector(state => state.settings.theme);

export const useIsLoading = () => 
  useAppSelector(state => state.workspace.ui.isLoading || state.nodes.isLoading);

// Derived state hooks
export const useNodeById = (id: string) => 
  useAppSelector(state => state.nodes.nodes.entities[id]);

export const useConnectionById = (id: string) => 
  useAppSelector(state => state.nodes.connections.entities[id]);

export const useNodeConnections = (nodeId: string) => 
  useAppSelector(state => 
    Object.values(state.nodes.connections.entities)
      .filter((conn): conn is Connection => 
        conn !== undefined && (conn.sourceNodeId === nodeId || conn.targetNodeId === nodeId)
      )
  );

export const useSelectedItems = () => 
  useAppSelector(state => ({
    nodeIds: state.nodes.selectedNodeIds,
    connectionIds: state.nodes.selectedConnectionIds,
    layerIds: state.workspace.selectedItems.layerIds,
  }));