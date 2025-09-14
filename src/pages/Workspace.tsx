import React, { useState } from 'react';
import { NodeData } from '../components/Canvas/Node';
import WorkspaceCanvas from '../components/Canvas/WorkspaceCanvas';
import Sidebar from '../components/Layout/Sidebar';
import Header from '../components/Layout/Header';
import { NodeType } from '../components/Sidebar/NodePalette';

const Workspace: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [nodes, setNodes] = useState<NodeData[]>([
    { id: '1', type: 'input', label: 'Input 1', x: 100, y: 100 },
    { id: '2', type: 'hidden', label: 'Hidden 1', x: 250, y: 80, activation: 'ReLU' },
    { id: '3', type: 'hidden', label: 'Hidden 2', x: 250, y: 140, activation: 'ReLU' },
    { id: '4', type: 'output', label: 'Output', x: 400, y: 110, activation: 'Sigmoid' },
  ]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const selectedNode = nodes.find(node => node.id === selectedNodeId) || null;

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNodeAdd = (nodeType: NodeType['type'], position?: { x: number; y: number }) => {
    // Use provided position or find center of visible canvas area
    let centerX = 400; // Default center X
    let centerY = 300; // Default center Y
    
    if (position) {
      centerX = position.x;
      centerY = position.y;
    }
    
    const newNode: NodeData = {
      id: Date.now().toString(),
      type: nodeType,
      label: `${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} ${nodes.length + 1}`,
      x: centerX + Math.random() * 10 - 5, // Add small randomness to avoid exact overlap
      y: centerY + Math.random() * 10 - 5,
      activation: nodeType === 'input' ? undefined : 'ReLU',
    };
    
    setNodes(prev => [...prev, newNode]);
  };

  const handleNodeUpdate = (nodeId: string, updates: Partial<NodeData>) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    ));
  };

  const handleNodeDelete = (nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
  };

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  const handleNodeDrag = (nodeId: string, x: number, y: number) => {
    handleNodeUpdate(nodeId, { x, y });
  };

  return (
    <div className="h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={handleToggleSidebar}
          selectedNode={selectedNode}
          onNodeAdd={handleNodeAdd}
          onNodeUpdate={handleNodeUpdate}
          onNodeDelete={handleNodeDelete}
        />
        <div className="flex-1 relative">
          <WorkspaceCanvas 
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            onNodeSelect={handleNodeSelect}
            onNodeDrag={handleNodeDrag}
            onNodeAdd={handleNodeAdd}
          />
        </div>
      </div>
    </div>
  );
};

export default Workspace;