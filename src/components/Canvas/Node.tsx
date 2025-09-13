import React from 'react';
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
  scale?: number;
}

const Node: React.FC<NodeProps> = ({ 
  node, 
  onSelect, 
  onDrag, 
  scale = 1 
}) => {
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
      whileHover={{ scale: 1.1 }}
      whileDrag={{ scale: 1.2, zIndex: 30 }}
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
      <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-crosshair"></div>
      <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-crosshair"></div>
    </motion.div>
  );
};

export default Node;