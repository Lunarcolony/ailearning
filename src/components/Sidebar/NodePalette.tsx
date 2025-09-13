import React from 'react';
import { Circle, Square, Triangle, Zap, Brain, Eye, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export interface NodeType {
  id: string;
  type: 'input' | 'hidden' | 'output' | 'activation';
  label: string;
  icon: React.ComponentType<any>;
  description: string;
  category: string;
}

const nodeTypes: NodeType[] = [
  // Input Nodes
  {
    id: 'input',
    type: 'input',
    label: 'Input Layer',
    icon: Circle,
    description: 'Input data entry point',
    category: 'Input/Output'
  },
  {
    id: 'output',
    type: 'output', 
    label: 'Output Layer',
    icon: Square,
    description: 'Final prediction output',
    category: 'Input/Output'
  },
  
  // Hidden Layers
  {
    id: 'dense',
    type: 'hidden',
    label: 'Dense Layer',
    icon: Brain,
    description: 'Fully connected layer',
    category: 'Core Layers'
  },
  {
    id: 'conv',
    type: 'hidden',
    label: 'Conv Layer',
    icon: Eye,
    description: 'Convolutional layer for image processing',
    category: 'Core Layers'
  },
  
  // Activation Functions
  {
    id: 'relu',
    type: 'activation',
    label: 'ReLU',
    icon: Zap,
    description: 'Rectified Linear Unit activation',
    category: 'Activations'
  },
  {
    id: 'sigmoid',
    type: 'activation',
    label: 'Sigmoid',
    icon: Activity,
    description: 'Sigmoid activation function',
    category: 'Activations'
  }
];

interface NodePaletteProps {
  onNodeDragStart?: (nodeType: NodeType) => void;
  onNodeAdd?: (nodeType: NodeType['type']) => void;
}

const NodePalette: React.FC<NodePaletteProps> = ({ onNodeDragStart, onNodeAdd }) => {
  const categories = [...new Set(nodeTypes.map(node => node.category))];

  const handleNodeClick = (nodeType: NodeType) => {
    if (onNodeAdd) {
      onNodeAdd(nodeType.type);
    }
  };

  const handleDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/json', JSON.stringify(nodeType));
    if (onNodeDragStart) {
      onNodeDragStart(nodeType);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Node Library
      </h3>
      
      {categories.map((category) => (
        <div key={category} className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            {category}
          </h4>
          
          <div className="space-y-1">
            {nodeTypes
              .filter(node => node.category === category)
              .map((nodeType) => {
                const Icon = nodeType.icon;
                return (
                  <motion.div
                    key={nodeType.id}
                    className="group cursor-grab active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => handleDragStart(e, nodeType)}
                    onClick={() => handleNodeClick(nodeType)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 shadow-sm hover:shadow-md">
                      <div className="flex-shrink-0 mr-3">
                        <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-800/50 transition-colors">
                          <Icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {nodeType.label}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {nodeType.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NodePalette;