import React from 'react';
import { Settings, Info, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { NodeData } from '../Canvas/Node';

interface PropertiesPanelProps {
  selectedNode: NodeData | null;
  onNodeUpdate?: (nodeId: string, updates: Partial<NodeData>) => void;
  onNodeDelete?: (nodeId: string) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ 
  selectedNode, 
  onNodeUpdate, 
  onNodeDelete 
}) => {
  const activationOptions = ['ReLU', 'Sigmoid', 'Tanh', 'Softmax', 'Leaky ReLU', 'ELU', 'GELU'];

  const handleLabelChange = (value: string) => {
    if (selectedNode && onNodeUpdate) {
      onNodeUpdate(selectedNode.id, { label: value });
    }
  };

  const handleActivationChange = (value: string) => {
    if (selectedNode && onNodeUpdate) {
      onNodeUpdate(selectedNode.id, { activation: value });
    }
  };

  const handleDelete = () => {
    if (selectedNode && onNodeDelete) {
      onNodeDelete(selectedNode.id);
    }
  };

  if (!selectedNode) {
    return (
      <div className="p-4 h-full flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <Info className="w-8 h-8 text-gray-400 dark:text-gray-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Node Selected
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Select a node on the canvas to view and edit its properties.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Properties
        </h3>
        <motion.button
          onClick={handleDelete}
          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Delete node"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="space-y-4">
        {/* Node Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Node Type
          </label>
          <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <span className="text-sm text-gray-900 dark:text-white capitalize">
              {selectedNode.type}
            </span>
          </div>
        </div>

        {/* Node Label */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Label
          </label>
          <input
            type="text"
            value={selectedNode.label}
            onChange={(e) => handleLabelChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            placeholder="Node label"
          />
        </div>

        {/* Activation Function (for hidden and output layers) */}
        {(selectedNode.type === 'hidden' || selectedNode.type === 'output') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Activation Function
            </label>
            <select
              value={selectedNode.activation || 'ReLU'}
              onChange={(e) => handleActivationChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            >
              {activationOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Position */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              X Position
            </label>
            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <span className="text-sm text-gray-900 dark:text-white">
                {Math.round(selectedNode.x)}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Y Position
            </label>
            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <span className="text-sm text-gray-900 dark:text-white">
                {Math.round(selectedNode.y)}
              </span>
            </div>
          </div>
        </div>

        {/* Node ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Node ID
          </label>
          <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <span className="text-sm font-mono text-gray-900 dark:text-white">
              {selectedNode.id}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;