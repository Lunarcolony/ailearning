import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Circle, Square, Triangle, Zap } from 'lucide-react';

export interface NodeData {
  id: string;
  type: 'input' | 'hidden' | 'output' | 'activation';
  label: string;
  x: number;
  y: number;
  activation?: string;
  selected?: boolean;
}

interface NodeProps {
  node: NodeData;
  onSelect?: (nodeId: string) => void;
  onDrag?: (nodeId: string, x: number, y: number) => void;
  onConnectionStart?: (nodeId: string, event: React.MouseEvent) => void;
  onConnectionEnd?: (nodeId: string) => void;
  connectionInProgress?: boolean;
  scale?: number;
}

const Node: React.FC<NodeProps> = ({ 
  node, 
  onSelect, 
  onDrag, 
  onConnectionStart,
  onConnectionEnd,
  connectionInProgress = false,
  scale = 1 
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const getNodeIcon = () => {
    switch (node.type) {
      case 'input':
        return Circle;
      case 'hidden':
        return Square;
      case 'output':
        return Triangle;
      case 'activation':
        return Zap;
      default:
        return Circle;
    }
  };

  const getNodeColor = () => {
    switch (node.type) {
      case 'input':
        return 'bg-green-500 border-green-600';
      case 'hidden':
        return 'bg-blue-500 border-blue-600';
      case 'output':
        return 'bg-red-500 border-red-600';
      case 'activation':
        return 'bg-purple-500 border-purple-600';
      default:
        return 'bg-gray-500 border-gray-600';
    }
  };

  const Icon = getNodeIcon();

  const handleConnectionStart = (event: React.MouseEvent, side: 'left' | 'right') => {
    event.stopPropagation();
    if (onConnectionStart) {
      onConnectionStart(node.id, event);
    }
  };

  const handleConnectionEnd = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onConnectionEnd) {
      onConnectionEnd(node.id);
    }
  };

  return (
    <motion.div
      className={`absolute cursor-grab active:cursor-grabbing ${
        node.selected ? 'z-20' : 'z-10'
      }`}
      style={{
        left: node.x * scale,
        top: node.y * scale,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      drag
      onDragEnd={(_, info) => {
        if (onDrag) {
          onDrag(
            node.id,
            node.x + info.offset.x / scale,
            node.y + info.offset.y / scale
          );
        }
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      whileHover={{ scale: 1.05 }}
      whileDrag={{ scale: 1.1, zIndex: 30 }}
    >
      <div
        className={`neural-node w-16 h-16 flex items-center justify-center ${getNodeColor()} ${
          node.selected 
            ? 'ring-4 ring-primary-400 ring-opacity-60 shadow-xl' 
            : 'shadow-md hover:shadow-lg'
        }`}
        onClick={() => onSelect?.(node.id)}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      
      {/* Node Label */}
      <div className="mt-2 text-xs font-medium text-center text-gray-700 dark:text-gray-300 min-w-16 max-w-20 break-words">
        {node.label}
      </div>
      
      {/* Activation Function Label */}
      {node.activation && (
        <div className="mt-1 text-xs text-center text-gray-500 dark:text-gray-400 min-w-16 max-w-20 break-words">
          {node.activation}
        </div>
      )}
      
      {/* Connection Points */}
      {/* Input connection point (only show on non-input nodes) */}
      {node.type !== 'input' && (
        <div 
          className={`absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white dark:bg-gray-800 border-2 border-blue-400 rounded-full transition-all duration-200 cursor-crosshair ${
            isHovering ? 'opacity-100 scale-110' : 'opacity-0'
          }`}
          onMouseDown={(e) => handleConnectionEnd(e)}
          title="Connect input"
        />
      )}
      
      {/* Output connection point (only show on non-output nodes) */}
      {node.type !== 'output' && (
        <div 
          className={`absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white dark:bg-gray-800 border-2 border-green-400 rounded-full transition-all duration-200 cursor-crosshair ${
            isHovering ? 'opacity-100 scale-110' : 'opacity-0'
          }`}
          onMouseDown={(e) => handleConnectionStart(e, 'right')}
          title="Connect output"
        />
      )}
    </motion.div>
  );
};

export default Node;