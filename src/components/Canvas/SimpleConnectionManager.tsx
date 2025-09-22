import React from 'react';
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

  // Calculate bounds for all nodes to ensure SVG covers the full area needed
  const calculateSVGBounds = () => {
    if (nodes.length === 0) {
      return { minX: -5000, minY: -5000, width: 10000, height: 10000 };
    }

    const positions = nodes.map(node => ({ x: node.x + 32, y: node.y + 32 }));
    const minX = Math.min(...positions.map(p => p.x)) - 1000;
    const maxX = Math.max(...positions.map(p => p.x)) + 1000;
    const minY = Math.min(...positions.map(p => p.y)) - 1000;
    const maxY = Math.max(...positions.map(p => p.y)) + 1000;

    return {
      minX,
      minY,
      width: maxX - minX,
      height: maxY - minY
    };
  };

  const svgBounds = calculateSVGBounds();

  return (
    <svg
      className="absolute pointer-events-none"
      style={{ 
        left: svgBounds.minX,
        top: svgBounds.minY,
        width: svgBounds.width,
        height: svgBounds.height,
        zIndex: 5 
      }}
      viewBox={`0 0 ${svgBounds.width} ${svgBounds.height}`}
    >
      <g className="pointer-events-auto">
        {connections.map(connection => {
          const sourcePos = getNodePosition(connection.sourceNodeId);
          const targetPos = getNodePosition(connection.targetNodeId);
          
          // Adjust positions relative to SVG bounds
          const adjustedSourcePos = {
            x: sourcePos.x - svgBounds.minX,
            y: sourcePos.y - svgBounds.minY
          };
          const adjustedTargetPos = {
            x: targetPos.x - svgBounds.minX,
            y: targetPos.y - svgBounds.minY
          };
          
          return (
            <Connection
              key={connection.id}
              connection={connection}
              sourcePos={adjustedSourcePos}
              targetPos={adjustedTargetPos}
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