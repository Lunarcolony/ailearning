import React, { useState } from 'react';
import { NodeData } from '../components/Canvas/Node';
import WorkspaceCanvas from '../components/Canvas/WorkspaceCanvas';
import Sidebar from '../components/Layout/Sidebar';
import Header from '../components/Layout/Header';
import { NodeType } from '../components/Sidebar/NodePalette';
import { useLayers } from '../hooks/useLayers';

const Workspace: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [nodes, setNodes] = useState<NodeData[]>([
    { id: '1', type: 'input', label: 'Input 1', x: 100, y: 100 },
    { id: '2', type: 'hidden', label: 'Hidden 1', x: 250, y: 80, activation: 'ReLU' },
    { id: '3', type: 'hidden', label: 'Hidden 2', x: 250, y: 140, activation: 'ReLU' },
    { id: '4', type: 'output', label: 'Output', x: 400, y: 110, activation: 'Sigmoid' },
  ]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Use the layers hook
  const {
    layers,
    selectedLayers,
    addLayer,
    updateLayer,
    removeLayer,
    selectLayer,
    clearSelection,
    moveLayer,
    resizeLayer,
    toggleLayerVisibility,
  } = useLayers();

  const selectedNode = nodes.find(node => node.id === selectedNodeId) || null;
  const selectedLayerIds = selectedLayers.map(layer => layer.id);

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
    handleNodeDragEnd(nodeId, x, y);
  };

  // Layer management functions
  const handleLayerAdd = () => {
    const layerCount = layers.length + 1;
    const defaultColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const color = defaultColors[(layerCount - 1) % defaultColors.length];
    
    addLayer({
      name: `Layer ${layerCount}`,
      type: 'custom',
      nodeIds: [],
      position: layerCount,
      visual: {
        position: { x: 50 + (layerCount * 20), y: 50 + (layerCount * 20) },
        dimensions: { width: 300, height: 200 },
        color,
        opacity: 0.3,
        visible: true,
        zIndex: layerCount,
      },
    });
  };

  const handleLayerSelect = (layerId: string, addToSelection = false) => {
    selectLayer(layerId, addToSelection);
  };

  const handleLayerMove = (layerId: string, x: number, y: number) => {
    moveLayer(layerId, { x, y });
  };

  const handleLayerResize = (layerId: string, width: number, height: number) => {
    resizeLayer(layerId, { width, height });
  };

  // Helper function to check if a node is inside a layer
  const isNodeInLayer = (nodeX: number, nodeY: number, layer: any) => {
    if (!layer.visual) return false;
    const { position, dimensions } = layer.visual;
    return (
      nodeX >= position.x &&
      nodeX <= position.x + dimensions.width &&
      nodeY >= position.y &&
      nodeY <= position.y + dimensions.height
    );
  };

  // Auto-assign nodes to layers based on position
  const handleNodeDragEnd = (nodeId: string, x: number, y: number) => {
    handleNodeUpdate(nodeId, { x, y });
    
    // Check which layer this node is in
    for (const layer of layers) {
      if (layer.visual && isNodeInLayer(x, y, layer)) {
        if (!layer.nodeIds.includes(nodeId)) {
          // Remove node from other layers
          layers.forEach(otherLayer => {
            if (otherLayer.id !== layer.id && otherLayer.nodeIds.includes(nodeId)) {
              updateLayer(otherLayer.id, {
                nodeIds: otherLayer.nodeIds.filter(id => id !== nodeId)
              });
            }
          });
          
          // Add node to this layer
          updateLayer(layer.id, {
            nodeIds: [...layer.nodeIds, nodeId]
          });
        }
        break;
      }
    }
  };

  return (
    <div className="h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={handleToggleSidebar}
          selectedNode={selectedNode}
          layers={layers}
          selectedLayerIds={selectedLayerIds}
          onNodeAdd={handleNodeAdd}
          onNodeUpdate={handleNodeUpdate}
          onNodeDelete={handleNodeDelete}
          onLayerAdd={handleLayerAdd}
          onLayerSelect={handleLayerSelect}
          onLayerUpdate={updateLayer}
          onLayerDelete={removeLayer}
          onLayerToggleVisibility={toggleLayerVisibility}
        />
        <div className="flex-1 relative">
          <WorkspaceCanvas 
            nodes={nodes}
            layers={layers}
            selectedNodeId={selectedNodeId}
            selectedLayerIds={selectedLayerIds}
            onNodeSelect={handleNodeSelect}
            onNodeDrag={handleNodeDrag}
            onNodeAdd={handleNodeAdd}
            onLayerSelect={(layerId) => handleLayerSelect(layerId, false)}
            onLayerMove={handleLayerMove}
            onLayerResize={handleLayerResize}
          />
        </div>
      </div>
    </div>
  );
};

export default Workspace;