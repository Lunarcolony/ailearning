import { useState, useCallback } from 'react';

export interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: any;
  selected?: boolean;
}

interface UseNodesReturn {
  nodes: Node[];
  selectedNodes: Node[];
  addNode: (node: Omit<Node, 'id'>) => void;
  removeNode: (nodeId: string) => void;
  updateNode: (nodeId: string, updates: Partial<Node>) => void;
  selectNode: (nodeId: string, multiSelect?: boolean) => void;
  clearSelection: () => void;
  moveSelectedNodes: (deltaX: number, deltaY: number) => void;
}

export const useNodes = (): UseNodesReturn => {
  const [nodes, setNodes] = useState<Node[]>([]);

  const selectedNodes = nodes.filter(node => node.selected);

  const addNode = useCallback((node: Omit<Node, 'id'>) => {
    const newNode: Node = {
      ...node,
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    setNodes(prev => [...prev, newNode]);
  }, []);

  const removeNode = useCallback((nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
  }, []);

  const updateNode = useCallback((nodeId: string, updates: Partial<Node>) => {
    setNodes(prev => 
      prev.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      )
    );
  }, []);

  const selectNode = useCallback((nodeId: string, multiSelect = false) => {
    setNodes(prev => 
      prev.map(node => ({
        ...node,
        selected: node.id === nodeId ? true : multiSelect ? node.selected : false
      }))
    );
  }, []);

  const clearSelection = useCallback(() => {
    setNodes(prev => 
      prev.map(node => ({ ...node, selected: false }))
    );
  }, []);

  const moveSelectedNodes = useCallback((deltaX: number, deltaY: number) => {
    setNodes(prev =>
      prev.map(node =>
        node.selected
          ? {
              ...node,
              position: {
                x: node.position.x + deltaX,
                y: node.position.y + deltaY
              }
            }
          : node
      )
    );
  }, []);

  return {
    nodes,
    selectedNodes,
    addNode,
    removeNode,
    updateNode,
    selectNode,
    clearSelection,
    moveSelectedNodes
  };
};