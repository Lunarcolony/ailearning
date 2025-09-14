import React, { useState, useCallback } from 'react';
import { NodeData } from './Node';
import { Connection as ConnectionData } from '../../hooks/useConnections';
import Connection from './Connection';

interface ConnectionManagerProps {
  nodes: NodeData[];
  connections: ConnectionData[];
  selectedConnectionId?: string | null;
  onConnectionAdd?: (sourceNodeId: string, targetNodeId: string) => void;
  onConnectionDelete?: (connectionId: string) => void;
  onConnectionSelect?: (connectionId: string) => void;
  scale?: number;
}

interface TempConnection {
  sourceNodeId: string;
  sourcePos: { x: number; y: number };
  currentPos: { x: number; y: number };
}

const ConnectionManager: React.FC<ConnectionManagerProps> = ({
  nodes,
  connections,
  selectedConnectionId,
  onConnectionAdd,
  onConnectionDelete,
  onConnectionSelect,
  scale = 1
}) => {
  const [tempConnection, setTempConnection] = useState<TempConnection | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Get node position by ID
  const getNodePosition = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };
    
    // Return center of node (node is 64px wide/high)
    return {
      x: node.x + 32,
      y: node.y + 32
    };
  }, [nodes]);

  // Handle starting a connection drag
  const handleConnectionStart = useCallback((sourceNodeId: string, event: MouseEvent) => {
    const sourcePos = getNodePosition(sourceNodeId);
    setTempConnection({
      sourceNodeId,
      sourcePos,
      currentPos: sourcePos
    });
    setIsDragging(true);
  }, [getNodePosition]);

  // Handle mouse move during connection drag
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!tempConnection || !isDragging) return;
    
    // Convert screen coordinates to canvas coordinates
    const rect = (event.target as HTMLElement)?.closest('.canvas-container')?.getBoundingClientRect();
    if (!rect) return;
    
    const canvasX = (event.clientX - rect.left) / scale;
    const canvasY = (event.clientY - rect.top) / scale;
    
    setTempConnection(prev => prev ? {
      ...prev,
      currentPos: { x: canvasX, y: canvasY }
    } : null);
  }, [tempConnection, isDragging, scale]);

  // Handle ending a connection drag
  const handleConnectionEnd = useCallback((targetNodeId?: string) => {
    if (tempConnection && targetNodeId && targetNodeId !== tempConnection.sourceNodeId) {
      if (onConnectionAdd) {
        onConnectionAdd(tempConnection.sourceNodeId, targetNodeId);
      }
    }
    
    setTempConnection(null);
    setIsDragging(false);
  }, [tempConnection, onConnectionAdd]);

  // Handle clicking on canvas to cancel connection
  const handleCanvasClick = useCallback(() => {
    if (tempConnection) {
      handleConnectionEnd();
    }
  }, [tempConnection, handleConnectionEnd]);

  // Expose connection handlers to parent
  React.useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => handleMouseMove(e);
    const handleGlobalMouseUp = () => handleConnectionEnd();
    
    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleConnectionEnd]);

  return (
    <>
      {/* Render existing connections */}
      <svg
        className="absolute inset-0 pointer-events-none"
        style={{ width: '100%', height: '100%' }}
      >
        <g className="pointer-events-auto">
          {connections.map(connection => {
            const sourcePos = getNodePosition(connection.sourceNodeId);
            const targetPos = getNodePosition(connection.targetNodeId);
            
            return (
              <Connection
                key={connection.id}
                connection={connection}
                sourcePos={sourcePos}
                targetPos={targetPos}
                selected={connection.id === selectedConnectionId}
                onSelect={onConnectionSelect}
                onDelete={onConnectionDelete}
                scale={scale}
              />
            );
          })}
          
          {/* Render temporary connection while dragging */}
          {tempConnection && (
            <g>
              <path
                d={`M ${tempConnection.sourcePos.x} ${tempConnection.sourcePos.y} L ${tempConnection.currentPos.x} ${tempConnection.currentPos.y}`}
                stroke="#3b82f6"
                strokeWidth={2}
                strokeDasharray="5,5"
                fill="none"
                className="pointer-events-none"
              />
              <circle
                cx={tempConnection.currentPos.x}
                cy={tempConnection.currentPos.y}
                r={4}
                fill="#3b82f6"
                className="pointer-events-none"
              />
            </g>
          )}
        </g>
      </svg>
      
      {/* Canvas click handler */}
      <div 
        className="absolute inset-0 pointer-events-auto"
        onClick={handleCanvasClick}
        style={{ zIndex: -1 }}
      />
    </>
  );
};

export default ConnectionManager;

// Export the connection handlers for use by Node components
export const useConnectionHandlers = (nodeId: string) => {
  const [connectionManager, setConnectionManager] = useState<ConnectionManager | null>(null);
  
  const startConnection = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    const mouseEvent = event.nativeEvent;
    
    // Dispatch custom event that ConnectionManager can listen to
    const customEvent = new CustomEvent('connectionStart', {
      detail: { nodeId, mouseEvent }
    });
    window.dispatchEvent(customEvent);
  }, [nodeId]);
  
  const endConnection = useCallback(() => {
    const customEvent = new CustomEvent('connectionEnd', {
      detail: { nodeId }
    });
    window.dispatchEvent(customEvent);
  }, [nodeId]);
  
  return { startConnection, endConnection };
};