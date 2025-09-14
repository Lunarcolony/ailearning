import React, { useState } from 'react';
import { Settings, Info, Trash2, Code } from 'lucide-react';
import { motion } from 'framer-motion';
import { NodeData } from '../Canvas/Node';

interface PropertiesPanelProps {
  selectedNode: NodeData | null;
  nodes?: NodeData[];
  connections?: any[];
  onNodeUpdate?: (nodeId: string, updates: Partial<NodeData>) => void;
  onNodeDelete?: (nodeId: string) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ 
  selectedNode, 
  nodes = [],
  connections = [],
  onNodeUpdate, 
  onNodeDelete 
}) => {
  const [showCodeGeneration, setShowCodeGeneration] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [codeFramework, setCodeFramework] = useState<'tensorflow' | 'pytorch' | 'numpy'>('tensorflow');
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

  const generateNetworkCode = () => {
    if (nodes.length === 0) return;
    
    let code = '';
    
    if (codeFramework === 'tensorflow') {
      code = `# Generated Neural Network using TensorFlow
# This code was auto-generated from the visual neural network builder

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

def create_model():
    model = keras.Sequential()
    
`;
      
      // Add layers based on nodes
      const sortedNodes = nodes.filter(n => n.type !== 'activation').sort((a, b) => {
        if (a.type === 'input') return -1;
        if (b.type === 'input') return 1;
        if (a.type === 'output') return 1;
        if (b.type === 'output') return -1;
        return 0;
      });
      
      sortedNodes.forEach((node, index) => {
        if (node.type === 'input') {
          code += `    # Input layer\n`;
          code += `    model.add(layers.Dense(64, input_shape=(784,), name='${node.label.replace(/\s+/g, '_').toLowerCase()}'))\n`;
        } else if (node.type === 'hidden') {
          code += `    # Hidden layer: ${node.label}\n`;
          code += `    model.add(layers.Dense(64, activation='${(node.activation || 'relu').toLowerCase()}', name='${node.label.replace(/\s+/g, '_').toLowerCase()}'))\n`;
        } else if (node.type === 'output') {
          code += `    # Output layer\n`;
          code += `    model.add(layers.Dense(1, activation='${(node.activation || 'sigmoid').toLowerCase()}', name='${node.label.replace(/\s+/g, '_').toLowerCase()}'))\n`;
        }
      });
      
      code += `
    return model

# Create and compile the model
model = create_model()
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Model summary
model.summary()

# Train the model (uncomment and provide your data)
# model.fit(X_train, y_train, epochs=10, validation_data=(X_val, y_val))
`;
    } else if (codeFramework === 'pytorch') {
      code = `# Generated Neural Network using PyTorch
# This code was auto-generated from the visual neural network builder

import torch
import torch.nn as nn
import torch.nn.functional as F

class NeuralNetwork(nn.Module):
    def __init__(self):
        super(NeuralNetwork, self).__init__()
        
`;
      
      const hiddenNodes = nodes.filter(n => n.type === 'hidden');
      hiddenNodes.forEach((node, index) => {
        code += `        self.${node.label.replace(/\s+/g, '_').toLowerCase()} = nn.Linear(64, 64)\n`;
      });
      
      code += `        self.output = nn.Linear(64, 1)
        
    def forward(self, x):
`;
      
      hiddenNodes.forEach((node, index) => {
        const activation = node.activation?.toLowerCase() || 'relu';
        code += `        x = F.${activation}(self.${node.label.replace(/\s+/g, '_').toLowerCase()}(x))\n`;
      });
      
      code += `        x = torch.sigmoid(self.output(x))
        return x

# Create model instance
model = NeuralNetwork()

# Define loss function and optimizer
criterion = nn.BCELoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

print(model)
`;
    }
    
    setGeneratedCode(code);
    setShowCodeGeneration(true);
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

        {/* Code Generation Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Code Generation
            </h4>
            <select
              value={codeFramework}
              onChange={(e) => setCodeFramework(e.target.value as any)}
              className="text-xs px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="tensorflow">TensorFlow</option>
              <option value="pytorch">PyTorch</option>
              <option value="numpy">NumPy</option>
            </select>
          </div>
          
          <motion.button
            onClick={generateNetworkCode}
            className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Code className="w-4 h-4 mr-2" />
            Generate Network Code
          </motion.button>

          {showCodeGeneration && generatedCode && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">Generated Code</span>
                <button
                  onClick={() => navigator.clipboard.writeText(generatedCode)}
                  className="text-xs text-blue-500 hover:text-blue-600"
                >
                  Copy
                </button>
              </div>
              <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded-lg overflow-auto max-h-64 font-mono">
                {generatedCode}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;