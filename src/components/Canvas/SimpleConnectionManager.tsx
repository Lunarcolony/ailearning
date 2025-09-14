import React, { useState } from 'react';
import { NodeData } from './Node';
import { Connection as ConnectionData } from '../../hooks/useConnections';
import Connection from './Connection';

interface SimpleConnectionManagerProps {
  nodes: NodeData[];
  connections: ConnectionData[];
  selectedConnectionId?: string | null;
  onConnectionAdd?: (sourceNodeId: string, targetNodeId: string) => void;
  onConnectionDelete?: (connectionId: string) => void;
  onConnectionSelect?: (connectionId: string) => void;
  scale?: number;
}

const SimpleConnectionManager: React.FC<SimpleConnectionManagerProps> = ({
  nodes,
  connections,
  selectedConnectionId,
  onConnectionAdd,
  onConnectionDelete,
  onConnectionSelect,
  scale = 1
}) => {
  // Get node position by ID (center of node)
  const getNodePosition = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };
    
    return {
      x: node.x + 32, // Center of 64px node
      y: node.y + 32
    };
  };

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%', zIndex: 5 }}
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
      </g>
    </svg>
  );
};

export default SimpleConnectionManager;