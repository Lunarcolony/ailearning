import { Node } from '../hooks/useNodes';
import { Connection } from '../hooks/useConnections';

export interface NetworkValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const validateNetwork = (nodes: Node[], connections: Connection[]): NetworkValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for isolated nodes
  const connectedNodeIds = new Set([
    ...connections.map(conn => conn.sourceNodeId),
    ...connections.map(conn => conn.targetNodeId)
  ]);
  
  const isolatedNodes = nodes.filter(node => !connectedNodeIds.has(node.id));
  if (isolatedNodes.length > 0) {
    warnings.push(`${isolatedNodes.length} isolated node(s) detected`);
  }

  // Check for circular dependencies
  const hasCircularDependency = detectCircularDependencies(nodes, connections);
  if (hasCircularDependency) {
    errors.push('Circular dependency detected in network');
  }

  // Check for minimum required nodes
  if (nodes.length === 0) {
    errors.push('Network must contain at least one node');
  }

  // Check for proper input/output nodes
  const inputNodes = nodes.filter(node => node.type === 'input');
  const outputNodes = nodes.filter(node => node.type === 'output');
  
  if (inputNodes.length === 0 && nodes.length > 0) {
    warnings.push('Network should have at least one input node');
  }
  
  if (outputNodes.length === 0 && nodes.length > 0) {
    warnings.push('Network should have at least one output node');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

const detectCircularDependencies = (nodes: Node[], connections: Connection[]): boolean => {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  const hasCycle = (nodeId: string): boolean => {
    if (recursionStack.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;

    visited.add(nodeId);
    recursionStack.add(nodeId);

    const outgoingConnections = connections.filter(conn => conn.sourceNodeId === nodeId);
    for (const conn of outgoingConnections) {
      if (hasCycle(conn.targetNodeId)) return true;
    }

    recursionStack.delete(nodeId);
    return false;
  };

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (hasCycle(node.id)) return true;
    }
  }

  return false;
};