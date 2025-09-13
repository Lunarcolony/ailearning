import React, { useState, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, RotateCcw, Move } from 'lucide-react';
import Node, { NodeData } from './Node';

interface WorkspaceCanvasProps {
  className?: string;
}

const WorkspaceCanvas: React.FC<WorkspaceCanvasProps> = ({ className = '' }) => {
  const [nodes, setNodes] = useState<NodeData[]>([
    { id: '1', type: 'input', label: 'Input 1', x: 100, y: 100 },
    { id: '2', type: 'hidden', label: 'Hidden 1', x: 250, y: 80, activation: 'ReLU' },
    { id: '3', type: 'hidden', label: 'Hidden 2', x: 250, y: 140, activation: 'ReLU' },
    { id: '4', type: 'output', label: 'Output', x: 400, y: 110, activation: 'Sigmoid' },
  ]);
  
  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set());
  const [scale, setScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLDivElement>(null);

  // Handle node selection
  const handleNodeSelect = useCallback((nodeId: string) => {
    setSelectedNodes(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(nodeId)) {
        newSelected.delete(nodeId);
      } else {
        newSelected.add(nodeId);
      }
      return newSelected;
    });
  }, []);

  // Handle node dragging
  const handleNodeDrag = useCallback((nodeId: string, x: number, y: number) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, x, y } : node
    ));
  }, []);

  // Handle canvas panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      setSelectedNodes(new Set()); // Clear selection when clicking on canvas
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      
      setPanOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, [isPanning, lastPanPoint]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Handle zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    const newScale = Math.min(Math.max(0.1, scale + delta), 3);
    setScale(newScale);
  }, [scale]);

  // Control functions
  const zoomIn = () => setScale(prev => Math.min(prev + 0.1, 3));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.1));
  const resetView = () => {
    setScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Add new node at center of viewport
  const addNode = (type: NodeData['type']) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const centerX = (rect.width / 2 - panOffset.x) / scale;
    const centerY = (rect.height / 2 - panOffset.y) / scale;
    
    const newNode: NodeData = {
      id: Date.now().toString(),
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${nodes.length + 1}`,
      x: centerX,
      y: centerY,
      activation: type === 'input' ? undefined : 'ReLU',
    };
    
    setNodes(prev => [...prev, newNode]);
  };

  // Create nodes with selection state
  const nodesWithSelection = useMemo(() => 
    nodes.map(node => ({ 
      ...node, 
      selected: selectedNodes.has(node.id) 
    })), 
    [nodes, selectedNodes]
  );

  return (
    <div className={`relative w-full h-full overflow-hidden bg-white dark:bg-gray-950 ${className}`}>
      {/* Canvas */}
      <div
        ref={canvasRef}
        className="w-full h-full grid-bg cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{
          backgroundPosition: `${panOffset.x}px ${panOffset.y}px`,
          backgroundSize: `${20 * scale}px ${20 * scale}px`,
        }}
      >
        {/* Nodes Container */}
        <div
          className="relative w-full h-full"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
          }}
        >
          {nodesWithSelection.map(node => (
            <Node
              key={node.id}
              node={node}
              onSelect={handleNodeSelect}
              onDrag={handleNodeDrag}
              scale={scale}
            />
          ))}
          
          {/* Temporary connection lines would go here */}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {/* Zoom Controls */}
        <div className="glass-effect rounded-lg p-2 shadow-lg">
          <div className="flex flex-col gap-1">
            <button
              onClick={zoomIn}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              title="Zoom In"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={zoomOut}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              title="Zoom Out"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={resetView}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Add Node Controls */}
        <div className="glass-effect rounded-lg p-2 shadow-lg">
          <div className="flex flex-col gap-1">
            <button
              onClick={() => addNode('input')}
              className="px-3 py-2 text-xs font-medium text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
              title="Add Input Node"
            >
              Input
            </button>
            <button
              onClick={() => addNode('hidden')}
              className="px-3 py-2 text-xs font-medium text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
              title="Add Hidden Node"
            >
              Hidden
            </button>
            <button
              onClick={() => addNode('output')}
              className="px-3 py-2 text-xs font-medium text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
              title="Add Output Node"
            >
              Output
            </button>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="absolute bottom-4 left-4 glass-effect rounded-lg px-3 py-2 shadow-lg">
        <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-300">
          <span>Nodes: {nodes.length}</span>
          <span>Zoom: {Math.round(scale * 100)}%</span>
          <span>Selected: {selectedNodes.size}</span>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceCanvas;