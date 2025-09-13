import { useState, useCallback } from 'react';

export interface Connection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourceHandle?: string;
  targetHandle?: string;
}

interface UseConnectionsReturn {
  connections: Connection[];
  addConnection: (connection: Omit<Connection, 'id'>) => void;
  removeConnection: (connectionId: string) => void;
  getNodeConnections: (nodeId: string) => Connection[];
  removeNodeConnections: (nodeId: string) => void;
}

export const useConnections = (): UseConnectionsReturn => {
  const [connections, setConnections] = useState<Connection[]>([]);

  const addConnection = useCallback((connection: Omit<Connection, 'id'>) => {
    const newConnection: Connection = {
      ...connection,
      id: `connection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    setConnections(prev => [...prev, newConnection]);
  }, []);

  const removeConnection = useCallback((connectionId: string) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
  }, []);

  const getNodeConnections = useCallback((nodeId: string) => {
    return connections.filter(
      conn => conn.sourceNodeId === nodeId || conn.targetNodeId === nodeId
    );
  }, [connections]);

  const removeNodeConnections = useCallback((nodeId: string) => {
    setConnections(prev =>
      prev.filter(
        conn => conn.sourceNodeId !== nodeId && conn.targetNodeId !== nodeId
      )
    );
  }, []);

  return {
    connections,
    addConnection,
    removeConnection,
    getNodeConnections,
    removeNodeConnections
  };
};