import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Plus, Minus, RotateCcw, Move } from 'lucide-react';
import Node, { NodeData } from './Node';
import SimpleConnectionManager from './SimpleConnectionManager';
import ContextMenu from './ContextMenu';
import { useConnections } from '../../hooks/useConnections';

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
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [connectionInProgress, setConnectionInProgress] = useState<{
    sourceNodeId: string;
    isActive: boolean;
  } | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    position: { x: number; y: number };
    nodeId: string | null;
  }>({ isOpen: false, position: { x: 0, y: 0 }, nodeId: null });
  const [selectionBox, setSelectionBox] = useState<{
    isActive: boolean;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null>(null);
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set());
  
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Initialize connections hook
  const {
    connections,
    addConnection,
    removeConnection,
    getNodeConnections,
    removeNodeConnections
  } = useConnections();

  // Add some default connections for demonstration
  React.useEffect(() => {
    // Add some sample connections if none exist
    if (connections.length === 0 && nodes.length >= 4) {
      // Connect the original 4 nodes in sequence
      const timer = setTimeout(() => {
        addConnection({ sourceNodeId: '1', targetNodeId: '2' }); // Data Input -> Hidden 1
        addConnection({ sourceNodeId: '2', targetNodeId: '3' }); // Hidden 1 -> Hidden 2  
        addConnection({ sourceNodeId: '3', targetNodeId: '4' }); // Hidden 2 -> Output
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [nodes, connections, addConnection]);

  // Connection handlers
  const handleConnectionAdd = useCallback((sourceNodeId: string, targetNodeId: string) => {
    // Validate connection (prevent self-connections and duplicates)
    if (sourceNodeId === targetNodeId) return;
    
    const existingConnection = connections.find(
      conn => conn.sourceNodeId === sourceNodeId && conn.targetNodeId === targetNodeId
    );
    if (existingConnection) return;
    
    addConnection({ sourceNodeId, targetNodeId });
  }, [connections, addConnection]);

  const handleConnectionDelete = useCallback((connectionId: string) => {
    removeConnection(connectionId);
    if (selectedConnectionId === connectionId) {
      setSelectedConnectionId(null);
    }
  }, [removeConnection, selectedConnectionId]);

  const handleConnectionSelect = useCallback((connectionId: string) => {
    setSelectedConnectionId(connectionId);
  }, []);

  const handleConnectionStart = useCallback((nodeId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setConnectionInProgress({ sourceNodeId: nodeId, isActive: true });
  }, []);

  const handleConnectionEnd = useCallback((nodeId: string) => {
    if (connectionInProgress && connectionInProgress.sourceNodeId !== nodeId) {
      handleConnectionAdd(connectionInProgress.sourceNodeId, nodeId);
    }
    setConnectionInProgress(null);
  }, [connectionInProgress]);

  // Context menu handlers
  const handleNodeContextMenu = useCallback((nodeId: string, position: { x: number; y: number }) => {
    setContextMenu({ isOpen: true, position, nodeId });
  }, []);

  const handleContextMenuClose = useCallback(() => {
    setContextMenu({ isOpen: false, position: { x: 0, y: 0 }, nodeId: null });
  }, []);

  const handleContextMenuConnect = useCallback((targetNodeId: string) => {
    if (contextMenu.nodeId) {
      handleConnectionAdd(contextMenu.nodeId, targetNodeId);
    }
  }, [contextMenu.nodeId, handleConnectionAdd]);

  const handleContextMenuDuplicate = useCallback(() => {
    if (contextMenu.nodeId && onNodeAdd) {
      const sourceNode = nodes.find(n => n.id === contextMenu.nodeId);
      if (sourceNode) {
        onNodeAdd(sourceNode.type);
      }
    }
  }, [contextMenu.nodeId, nodes, onNodeAdd]);

  const handleContextMenuDelete = useCallback(() => {
    if (contextMenu.nodeId && onNodeSelect) {
      // Remove connections first
      removeNodeConnections(contextMenu.nodeId);
      // Update selected node if needed
      if (selectedNodeId === contextMenu.nodeId) {
        onNodeSelect(''); // Clear selection
      }
      // The actual node removal should be handled by parent component
      // For now, we'll just clear selection
    }
  }, [contextMenu.nodeId, selectedNodeId, onNodeSelect, removeNodeConnections]);

  // Handle drop on canvas for drag-and-drop from palette
  const handleCanvasDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    if (!canvasRef.current || !onNodeAdd) return;
    
    try {
      const nodeTypeData = JSON.parse(event.dataTransfer.getData('application/json'));
      // Note: For now we'll add the node at the center since we need to modify onNodeAdd
      // to accept position parameters for proper drop positioning
      onNodeAdd(nodeTypeData.type);
    } catch (error) {
      console.error('Failed to parse dropped node data:', error);
    }
  }, [onNodeAdd]);

  // Handle node selection - support multi-select
  const handleNodeSelect = useCallback((nodeId: string, multiSelect: boolean = false) => {
    if (multiSelect) {
      setSelectedNodeIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(nodeId)) {
          newSet.delete(nodeId);
        } else {
          newSet.add(nodeId);
        }
        return newSet;
      });
    } else {
      setSelectedNodeIds(new Set([nodeId]));
      if (onNodeSelect) {
        onNodeSelect(nodeId);
      }
    }
  }, [onNodeSelect]);

  // Handle selection box
  const handleSelectionBoxStart = useCallback((event: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left - panOffset.x) / scale;
    const y = (event.clientY - rect.top - panOffset.y) / scale;
    
    setSelectionBox({
      isActive: true,
      startX: x,
      startY: y,
      currentX: x,
      currentY: y
    });
  }, [panOffset, scale]);

  const handleSelectionBoxUpdate = useCallback((event: React.MouseEvent) => {
    if (!selectionBox?.isActive || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left - panOffset.x) / scale;
    const y = (event.clientY - rect.top - panOffset.y) / scale;
    
    setSelectionBox(prev => prev ? {
      ...prev,
      currentX: x,
      currentY: y
    } : null);
  }, [selectionBox, panOffset, scale]);

  const handleSelectionBoxEnd = useCallback(() => {
    if (!selectionBox?.isActive) return;
    
    // Calculate selection bounds
    const minX = Math.min(selectionBox.startX, selectionBox.currentX);
    const maxX = Math.max(selectionBox.startX, selectionBox.currentX);
    const minY = Math.min(selectionBox.startY, selectionBox.currentY);
    const maxY = Math.max(selectionBox.startY, selectionBox.currentY);
    
    // Find nodes within selection bounds
    const selectedIds = new Set<string>();
    nodes.forEach(node => {
      if (node.x >= minX && node.x + 64 <= maxX && 
          node.y >= minY && node.y + 64 <= maxY) {
        selectedIds.add(node.id);
      }
    });
    
    setSelectedNodeIds(selectedIds);
    setSelectionBox(null);
  }, [selectionBox, nodes]);

  // Handle node dragging
  const handleNodeDrag = useCallback((nodeId: string, x: number, y: number) => {
    if (onNodeDrag) {
      onNodeDrag(nodeId, x, y);
    }
  }, [onNodeDrag]);

  // Handle canvas panning and selection
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return;
    
    if (e.shiftKey) {
      // Start selection box
      handleSelectionBoxStart(e);
    } else {
      // Start panning
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      // Clear selection when clicking on canvas
      setSelectedNodeIds(new Set());
      if (onNodeSelect) {
        onNodeSelect('');
      }
    }
  }, [handleSelectionBoxStart, onNodeSelect]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (selectionBox?.isActive) {
      handleSelectionBoxUpdate(e);
    } else if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      
      setPanOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, [isPanning, lastPanPoint, selectionBox, handleSelectionBoxUpdate]);

  const handleMouseUp = useCallback(() => {
    if (selectionBox?.isActive) {
      handleSelectionBoxEnd();
    }
    setIsPanning(false);
  }, [selectionBox, handleSelectionBoxEnd]);

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
      selected: selectedNodeIds.has(node.id) || node.id === selectedNodeId 
    })), 
    [nodes, selectedNodeIds, selectedNodeId]
  );

  // Selection box rendering helper
  const renderSelectionBox = () => {
    if (!selectionBox?.isActive) return null;
    
    const minX = Math.min(selectionBox.startX, selectionBox.currentX);
    const maxX = Math.max(selectionBox.startX, selectionBox.currentX);
    const minY = Math.min(selectionBox.startY, selectionBox.currentY);
    const maxY = Math.max(selectionBox.startY, selectionBox.currentY);
    
    return (
      <div
        className="absolute border-2 border-blue-400 bg-blue-100 bg-opacity-20 pointer-events-none"
        style={{
          left: minX,
          top: minY,
          width: maxX - minX,
          height: maxY - minY,
        }}
      />
    );
  };

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
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleCanvasDrop}
        style={{
          backgroundPosition: `${panOffset.x}px ${panOffset.y}px`,
          backgroundSize: `${20 * scale}px ${20 * scale}px`,
        }}
      >
        {/* Nodes Container */}
        <div
          className="relative w-full h-full canvas-container"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${scale})`,
            transformOrigin: '0 0',
          }}
        >
          {/* Selection Box */}
          {renderSelectionBox()}
          
          {/* Connection Manager */}
          <SimpleConnectionManager
            nodes={nodes}
            connections={connections}
            selectedConnectionId={selectedConnectionId}
            onConnectionAdd={handleConnectionAdd}
            onConnectionDelete={handleConnectionDelete}
            onConnectionSelect={handleConnectionSelect}
            scale={1} // Scale is handled by parent transform
          />
          
          {nodesWithSelection.map(node => (
            <Node
              key={node.id}
              node={node}
              onSelect={(nodeId) => handleNodeSelect(nodeId, false)}
              onDrag={handleNodeDrag}
              onConnectionStart={handleConnectionStart}
              onConnectionEnd={handleConnectionEnd}
              onContextMenu={handleNodeContextMenu}
              scale={1} // Scale is handled by parent transform
            />
          ))}
        </div>
      </div>

      {/* Context Menu */}
      <ContextMenu
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        node={contextMenu.nodeId ? nodes.find(n => n.id === contextMenu.nodeId) || null : null}
        availableNodes={nodes}
        onClose={handleContextMenuClose}
        onConnectTo={handleContextMenuConnect}
        onDelete={handleContextMenuDelete}
        onDuplicate={handleContextMenuDuplicate}
      />

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
          <span>Connections: {connections.length}</span>
          <span>Zoom: {Math.round(scale * 100)}%</span>
          <span>Selected: {selectedNodeIds.size || (selectedNodeId ? 1 : 0)}</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 glass-effect rounded-lg px-3 py-2 shadow-lg max-w-xs">
        <div className="text-xs text-gray-600 dark:text-gray-300">
          <div>• Drag to pan workspace</div>
          <div>• Shift+drag to select multiple nodes</div>
          <div>• Mouse wheel to zoom</div>
          <div>• Right-click nodes for options</div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceCanvas;