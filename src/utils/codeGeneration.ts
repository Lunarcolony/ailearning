import { Node } from '../hooks/useNodes';
import { Connection } from '../hooks/useConnections';

export interface CodeExportOptions {
  framework: 'tensorflow' | 'pytorch' | 'numpy';
  format: 'script' | 'notebook';
  includeComments: boolean;
  includeTraining: boolean;
}

export const generateCode = (
  nodes: Node[], 
  connections: Connection[], 
  options: CodeExportOptions
): string => {
  switch (options.framework) {
    case 'tensorflow':
      return generateTensorFlowCode(nodes, connections, options);
    case 'pytorch':
      return generatePyTorchCode(nodes, connections, options);
    case 'numpy':
      return generateNumpyCode(nodes, connections, options);
    default:
      throw new Error(`Unsupported framework: ${options.framework}`);
  }
};

const generateTensorFlowCode = (
  nodes: Node[], 
  connections: Connection[], 
  options: CodeExportOptions
): string => {
  let code = '';
  
  if (options.includeComments) {
    code += '# Generated Neural Network using TensorFlow\n';
    code += '# This code was auto-generated from the visual neural network builder\n\n';
  }
  
  code += 'import tensorflow as tf\n';
  code += 'from tensorflow import keras\n';
  code += 'from tensorflow.keras import layers\n\n';
  
  code += 'def create_model():\n';
  code += '    model = keras.Sequential()\n\n';
  
  // Sort nodes by their connections to create proper layer order
  const sortedNodes = topologicalSort(nodes, connections);
  
  sortedNodes.forEach((node, index) => {
    if (node.type !== 'input' && node.type !== 'output') {
      code += `    # Layer ${index + 1}: ${node.type}\n`;
      code += `    model.add(layers.${getKerasLayer(node)})\n`;
    }
  });
  
  code += '\n    return model\n\n';
  
  if (options.includeTraining) {
    code += 'model = create_model()\n';
    code += 'model.compile(optimizer="adam", loss="mse", metrics=["accuracy"])\n';
    code += '# model.fit(X_train, y_train, epochs=10, validation_data=(X_val, y_val))\n';
  }
  
  return code;
};

const generatePyTorchCode = (
  nodes: Node[], 
  connections: Connection[], 
  options: CodeExportOptions
): string => {
  let code = '';
  
  if (options.includeComments) {
    code += '# Generated Neural Network using PyTorch\n';
    code += '# This code was auto-generated from the visual neural network builder\n\n';
  }
  
  code += 'import torch\n';
  code += 'import torch.nn as nn\n';
  code += 'import torch.nn.functional as F\n\n';
  
  code += 'class NeuralNetwork(nn.Module):\n';
  code += '    def __init__(self):\n';
  code += '        super(NeuralNetwork, self).__init__()\n\n';
  
  const sortedNodes = topologicalSort(nodes, connections);
  
  sortedNodes.forEach((node, index) => {
    if (node.type !== 'input' && node.type !== 'output') {
      code += `        # Layer ${index + 1}: ${node.type}\n`;
      code += `        self.layer${index + 1} = ${getPyTorchLayer(node)}\n`;
    }
  });
  
  code += '\n    def forward(self, x):\n';
  
  sortedNodes.forEach((node, index) => {
    if (node.type !== 'input' && node.type !== 'output') {
      code += `        x = self.layer${index + 1}(x)\n`;
      if (node.data?.activation) {
        code += `        x = F.${node.data.activation}(x)\n`;
      }
    }
  });
  
  code += '        return x\n\n';
  
  if (options.includeTraining) {
    code += 'model = NeuralNetwork()\n';
    code += 'criterion = nn.MSELoss()\n';
    code += 'optimizer = torch.optim.Adam(model.parameters())\n';
  }
  
  return code;
};

const generateNumpyCode = (
  _nodes: Node[], 
  _connections: Connection[], 
  options: CodeExportOptions
): string => {
  let code = '';
  
  if (options.includeComments) {
    code += '# Generated Neural Network using NumPy\n';
    code += '# This code was auto-generated from the visual neural network builder\n\n';
  }
  
  code += 'import numpy as np\n\n';
  
  code += 'class NeuralNetwork:\n';
  code += '    def __init__(self):\n';
  code += '        # Initialize weights and biases\n';
  code += '        pass\n\n';
  
  code += '    def forward(self, x):\n';
  code += '        # Forward pass implementation\n';
  code += '        pass\n\n';
  
  code += '    def backward(self, x, y):\n';
  code += '        # Backward pass implementation\n';
  code += '        pass\n';
  
  return code;
};

const topologicalSort = (nodes: Node[], _connections: Connection[]): Node[] => {
  // Simple topological sort implementation
  // For now, just return nodes as-is
  return nodes;
};

const getKerasLayer = (node: Node): string => {
  switch (node.type) {
    case 'dense':
      return `Dense(${node.data?.units || 64}, activation='${node.data?.activation || 'relu'}')`;
    case 'dropout':
      return `Dropout(${node.data?.rate || 0.2})`;
    case 'conv2d':
      return `Conv2D(${node.data?.filters || 32}, (${node.data?.kernelSize || 3}, ${node.data?.kernelSize || 3}), activation='${node.data?.activation || 'relu'}')`;
    default:
      return `Dense(64, activation='relu')`;
  }
};

const getPyTorchLayer = (node: Node): string => {
  switch (node.type) {
    case 'dense':
      return `nn.Linear(${node.data?.inputSize || 784}, ${node.data?.units || 64})`;
    case 'dropout':
      return `nn.Dropout(${node.data?.rate || 0.2})`;
    case 'conv2d':
      return `nn.Conv2d(${node.data?.inChannels || 1}, ${node.data?.filters || 32}, ${node.data?.kernelSize || 3})`;
    default:
      return `nn.Linear(784, 64)`;
  }
};