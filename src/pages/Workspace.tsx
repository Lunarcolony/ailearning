import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addNode, updateNode, removeNode, selectNode, addLayer } from '../store/slices/nodesSlice';
import { NodeData } from '../components/Canvas/Node';
import WorkspaceCanvas from '../components/Canvas/WorkspaceCanvas';
import Sidebar from '../components/Layout/Sidebar';
import Header from '../components/Layout/Header';
import { NodeType } from '../components/Sidebar/NodePalette';

const Workspace: React.FC = () => {
  const dispatch = useDispatch();
  const { nodes, selectedNodeIds, layers } = useSelector((state: RootState) => state.nodes);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Initialize demo data
  useEffect(() => {
    if (nodes.length === 0 && layers.length === 1) { // Only default layer exists
      // Add some demo layers
      dispatch(addLayer({
        name: 'Input Layer',
        visible: true,
        color: '#10B981',
        order: 1
      }));
      
      dispatch(addLayer({
        name: 'Hidden Layers',
        visible: true,
        color: '#3B82F6',
        order: 2
      }));
      
      dispatch(addLayer({
        name: 'Output Layer',
        visible: true,
        color: '#EF4444',
        order: 3
      }));
    }
  }, [dispatch, nodes.length, layers.length]);

  // Add demo nodes after layers are created
  useEffect(() => {
    if (nodes.length === 0 && layers.length > 3) {
      // Add some demo nodes
      const inputLayer = layers.find(l => l.name === 'Input Layer');
      const hiddenLayer = layers.find(l => l.name === 'Hidden Layers');
      const outputLayer = layers.find(l => l.name === 'Output Layer');
      
      dispatch(addNode({
        type: 'input',
        position: { x: 100, y: 100 },
        data: { label: 'Input 1', activation: undefined },
        layerId: inputLayer?.id || 'default'
      }));
      
      dispatch(addNode({
        type: 'hidden',
        position: { x: 250, y: 80 },
        data: { label: 'Hidden 1', activation: 'ReLU' },
        layerId: hiddenLayer?.id || 'default'
      }));
      
      dispatch(addNode({
        type: 'hidden',
        position: { x: 250, y: 140 },
        data: { label: 'Hidden 2', activation: 'ReLU' },
        layerId: hiddenLayer?.id || 'default'
      }));
      
      dispatch(addNode({
        type: 'output',
        position: { x: 400, y: 110 },
        data: { label: 'Output', activation: 'Sigmoid' },
        layerId: outputLayer?.id || 'default'
      }));
    }
  }, [dispatch, nodes.length, layers]);
  
  const selectedNodeId = selectedNodeIds.length > 0 ? selectedNodeIds[0] : null;
  const selectedNode = selectedNodeId ? nodes.find(node => node.id === selectedNodeId) : null;
  
  // Convert Redux node to NodeData format for the PropertiesPanel
  const selectedNodeData: NodeData | null = selectedNode ? {
    id: selectedNode.id,
    type: selectedNode.type as 'input' | 'hidden' | 'output' | 'activation',
    label: selectedNode.data?.label || `Node ${selectedNode.id}`,
    x: selectedNode.position.x,
    y: selectedNode.position.y,
    activation: selectedNode.data?.activation,
    selected: true,
    layerId: selectedNode.layerId
  } : null;

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
    
    const newNodeData = {
      type: nodeType,
      position: { 
        x: centerX + Math.random() * 10 - 5, // Add small randomness to avoid exact overlap
        y: centerY + Math.random() * 10 - 5 
      },
      data: {
        label: `${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} ${nodes.length + 1}`,
        activation: nodeType === 'input' ? undefined : 'ReLU',
      }
    };
    
    dispatch(addNode(newNodeData));
  };

  const handleNodeUpdate = (nodeId: string, updates: Partial<NodeData>) => {
    // Convert NodeData updates back to Redux format
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    const reduxUpdates: any = {};
    
    if (updates.label) {
      reduxUpdates.data = { ...node.data, label: updates.label };
    }
    if (updates.activation) {
      reduxUpdates.data = { ...reduxUpdates.data || node.data, activation: updates.activation };
    }
    if (updates.x !== undefined || updates.y !== undefined) {
      reduxUpdates.position = {
        x: updates.x !== undefined ? updates.x : node.position.x,
        y: updates.y !== undefined ? updates.y : node.position.y
      };
    }
    
    dispatch(updateNode({ id: nodeId, updates: reduxUpdates }));
  };

  const handleNodeDelete = (nodeId: string) => {
    dispatch(removeNode(nodeId));
  };

  const handleNodeSelect = (nodeId: string) => {
    dispatch(selectNode({ nodeId }));
  };

  const handleNodeDrag = (nodeId: string, x: number, y: number) => {
    dispatch(updateNode({ 
      id: nodeId, 
      updates: { position: { x, y } }
    }));
  };

  return (
    <div className="h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={handleToggleSidebar}
          selectedNode={selectedNodeData}
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