import React, { useState, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, RotateCcw, Move } from 'lucide-react';
import Node, { NodeData } from './Node';

interface WorkspaceCanvasProps {
  className?: string;
  nodes?: NodeData[];
  selectedNodeId?: string | null;
  onNodeSelect?: (nodeId: string) => void;
  onNodeDrag?: (nodeId: string, x: number, y: number) => void;
  onNodeAdd?: (nodeType: NodeData['type']) => void;
}

const WorkspaceCanvas: React.FC<WorkspaceCanvasProps> = ({ 
  className = '', 
  nodes = [],
  selectedNodeId,
  onNodeSelect,
  onNodeDrag,
  onNodeAdd
}) => {
  const [scale, setScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLDivElement>(null);

  // Handle node selection
  const handleNodeSelect = useCallback((nodeId: string) => {
    if (onNodeSelect) {
      onNodeSelect(nodeId);
    }
  }, [onNodeSelect]);

  // Handle node dragging
  const handleNodeDrag = useCallback((nodeId: string, x: number, y: number) => {
    if (onNodeDrag) {
      onNodeDrag(nodeId, x, y);
    }
  }, [onNodeDrag]);

  // Handle canvas panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      // Clear node selection when clicking on canvas
      if (onNodeSelect) {
        onNodeSelect(''); // Clear selection by passing empty string
      }
    }
  }, [onNodeSelect]);

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
    if (onNodeAdd) {
      onNodeAdd(type);
    }
  };

  // Create nodes with selection state
  const nodesWithSelection = useMemo(() => 
    nodes.map(node => ({ 
      ...node, 
      selected: node.id === selectedNodeId 
    })), 
    [nodes, selectedNodeId]
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
      </div>

      {/* Status Bar */}
      <div className="absolute bottom-4 left-4 glass-effect rounded-lg px-3 py-2 shadow-lg">
        <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-300">
          <span>Nodes: {nodes.length}</span>
          <span>Zoom: {Math.round(scale * 100)}%</span>
          <span>Selected: {selectedNodeId ? 1 : 0}</span>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceCanvas;