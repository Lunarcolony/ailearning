import React from 'react';
import { motion } from 'framer-motion';
import { Connection as ConnectionData } from '../../hooks/useConnections';

interface ConnectionProps {
  connection: ConnectionData;
  sourcePos: { x: number; y: number };
  targetPos: { x: number; y: number };
  selected?: boolean;
  onSelect?: (connectionId: string) => void;
  onDelete?: (connectionId: string) => void;
  scale?: number;
}

const Connection: React.FC<ConnectionProps> = ({
  connection,
  sourcePos,
  targetPos,
  selected = false,
  onSelect,
  onDelete,
  scale = 1
}) => {
  // Calculate control points for a smooth curve
  const dx = targetPos.x - sourcePos.x;
  const dy = targetPos.y - sourcePos.y;
  
  // Use horizontal bezier curve for better visual flow
  const controlOffset = Math.abs(dx) * 0.5;
  const cp1x = sourcePos.x + controlOffset;
  const cp1y = sourcePos.y;
  const cp2x = targetPos.x - controlOffset;
  const cp2y = targetPos.y;

  const pathData = `M ${sourcePos.x} ${sourcePos.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${targetPos.x} ${targetPos.y}`;

  // Calculate midpoint for interaction area
  const midX = (sourcePos.x + targetPos.x) / 2;
  const midY = (sourcePos.y + targetPos.y) / 2;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(connection.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (onDelete) {
        onDelete(connection.id);
      }
    }
  };

  return (
    <g>
      {/* Main connection path */}
      <motion.path
        d={pathData}
        stroke={selected ? '#3b82f6' : '#6b7280'}
        strokeWidth={selected ? 3 : 2}
        fill="none"
        strokeLinecap="round"
        className="pointer-events-none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
      
      {/* Invisible wider path for easier interaction */}
      <path
        d={pathData}
        stroke="transparent"
        strokeWidth={12}
        fill="none"
        className="cursor-pointer hover:stroke-blue-200 hover:stroke-opacity-50"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      />
      
      {/* Connection weight indicator (small circle at midpoint) */}
      <motion.circle
        cx={midX}
        cy={midY}
        r={selected ? 4 : 3}
        fill={selected ? '#3b82f6' : '#9ca3af'}
        className="cursor-pointer"
        onClick={handleClick}
        whileHover={{ scale: 1.2 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3 }}
      />
      
      {/* Arrow head */}
      <motion.polygon
        points={`${targetPos.x-8},${targetPos.y-4} ${targetPos.x},${targetPos.y} ${targetPos.x-8},${targetPos.y+4}`}
        fill={selected ? '#3b82f6' : '#6b7280'}
        className="pointer-events-none"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4 }}
      />
    </g>
  );
};

export default Connection;