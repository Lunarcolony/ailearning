import React, { useState, useRef, useCallback } from 'react';
import { Circle, Square, Triangle, Zap } from 'lucide-react';

export interface NodeData {
  id: string;
  type: 'input' | 'hidden' | 'output' | 'activation';
  label: string;
  x: number;
  y: number;
  activation?: string;
  selected?: boolean;
  layerId?: string;
}

interface NodeProps {
  node: NodeData;
  onSelect?: (nodeId: string) => void;
  onDrag?: (nodeId: string, x: number, y: number) => void;
  onConnectionStart?: (nodeId: string, event: React.MouseEvent) => void;
  onConnectionEnd?: (nodeId: string) => void;
  onContextMenu?: (nodeId: string, position: { x: number; y: number }) => void;
  connectionInProgress?: boolean;
  scale?: number;
  layerColor?: string;
  layerVisible?: boolean;
}

const Node: React.FC<NodeProps> = ({ 
  node, 
  onSelect, 
  onDrag, 
  onConnectionStart,
  onConnectionEnd,
  onContextMenu,
  connectionInProgress = false,
  scale = 1,
  layerColor,
  layerVisible = true
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; nodeStartX: number; nodeStartY: number } | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault(); // Prevent browser context menu
    event.stopPropagation();
    
    if (onContextMenu) {
      onContextMenu(node.id, { x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (event.button !== 0) return; // Only handle left mouse button
    
    event.preventDefault();
    event.stopPropagation();
    
    setIsDragging(true);
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      nodeStartX: node.x,
      nodeStartY: node.y
    };

    // Select the node when starting to drag
    if (onSelect) {
      onSelect(node.id);
    }

    // Add global mouse event listeners
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      
      const deltaX = (e.clientX - dragRef.current.startX) / scale;
      const deltaY = (e.clientY - dragRef.current.startY) / scale;
      
      const newX = dragRef.current.nodeStartX + deltaX;
      const newY = dragRef.current.nodeStartY + deltaY;
      
      if (onDrag) {
        onDrag(node.id, newX, newY);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [node.id, node.x, node.y, scale, onSelect, onDrag]);
  const getNodeIcon = () => {
    switch (node.type) {
      case 'input':
        return Circle;
      case 'hidden':
        return Square;
      case 'output':
        return Triangle;
      case 'activation':
        return Zap;
      default:
        return Circle;
    }
  };

  const getNodeColor = () => {
    switch (node.type) {
      case 'input':
        return 'bg-green-500 border-green-600';
      case 'hidden':
        return 'bg-blue-500 border-blue-600';
      case 'output':
        return 'bg-red-500 border-red-600';
      case 'activation':
        return 'bg-purple-500 border-purple-600';
      default:
        return 'bg-gray-500 border-gray-600';
    }
  };

  const Icon = getNodeIcon();

  const handleConnectionStart = (event: React.MouseEvent, side: 'left' | 'right') => {
    event.stopPropagation();
    event.preventDefault();
    if (onConnectionStart) {
      onConnectionStart(node.id, event);
    }
  };

  const handleConnectionEnd = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (onConnectionEnd) {
      onConnectionEnd(node.id);
    }
  };

  // Handle drag-to-connect functionality
  const handleDragStart = (event: React.DragEvent) => {
    // Only enable drag-to-connect when not doing node positioning drag
    if (isDragging) {
      event.preventDefault();
      return;
    }
    
    // Set drag data for node-to-node connections
    event.dataTransfer.setData('application/json', JSON.stringify({ 
      type: 'node-connection',
      sourceNodeId: node.id 
    }));
    event.dataTransfer.effectAllowed = 'link';
  };

  const handleDragOver = (event: React.DragEvent) => {
    // Check if this is a node connection drag
    const types = Array.from(event.dataTransfer.types);
    if (types.includes('application/json')) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'link';
      setIsDraggedOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDraggedOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDraggedOver(false);
    
    try {
      const dragData = JSON.parse(event.dataTransfer.getData('application/json'));
      if (dragData.type === 'node-connection' && dragData.sourceNodeId !== node.id) {
        // Trigger connection between source and target nodes
        // Use the existing connection system through the WorkspaceCanvas
        if (onConnectionStart && onConnectionEnd) {
          // Simulate the connection process
          onConnectionStart(dragData.sourceNodeId, event as any);
          onConnectionEnd(node.id);
        }
      }
    } catch (error) {
      // Ignore errors for non-connection drags (like palette drags)
    }
  };

  return (
    <div
      className={`absolute select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${
        node.selected ? 'z-20' : 'z-10'
      } ${isDraggedOver ? 'ring-2 ring-yellow-400' : ''} ${
        !layerVisible ? 'opacity-30 pointer-events-none' : ''
      }`}
      style={{
        left: node.x,
        top: node.y,
        transform: isDragging ? 'scale(1.05)' : 'scale(1)',
        transition: isDragging ? 'none' : 'transform 0.15s ease-out',
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onContextMenu={handleContextMenu}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Layer Color Indicator */}
      {layerColor && (
        <div
          className="absolute -top-1 -left-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900"
          style={{ backgroundColor: layerColor }}
          title={`Layer: ${node.layerId || 'default'}`}
        />
      )}
      
      <div
        className={`neural-node w-16 h-16 flex items-center justify-center ${getNodeColor()} ${
          node.selected 
            ? 'ring-4 ring-blue-400 ring-opacity-60 shadow-xl' 
            : 'shadow-md hover:shadow-lg'
        } ${isDragging ? 'shadow-2xl' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(node.id);
        }}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      
      {/* Node Label */}
      <div className="mt-2 text-xs font-medium text-center text-gray-700 dark:text-gray-300 min-w-16 max-w-20 break-words">
        {node.label}
      </div>
      
      {/* Activation Function Label */}
      {node.activation && (
        <div className="mt-1 text-xs text-center text-gray-500 dark:text-gray-400 min-w-16 max-w-20 break-words">
          {node.activation}
        </div>
      )}
      
      {/* Connection Points */}
      {/* Input connection point (only show on non-input nodes) */}
      {node.type !== 'input' && (
        <div 
          className={`absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white dark:bg-gray-800 border-2 border-blue-400 rounded-full transition-all duration-200 cursor-crosshair ${
            isHovering || connectionInProgress ? 'opacity-100 scale-110' : 'opacity-70'
          }`}
          onMouseDown={(e) => {
            e.stopPropagation();
            handleConnectionEnd(e);
          }}
          onDrop={(e) => {
            e.stopPropagation();
            handleDrop(e as any);
          }}
          onDragOver={(e) => {
            e.stopPropagation();
            handleDragOver(e as any);
          }}
          title="Drop connection here or click to connect"
        />
      )}
      
      {/* Output connection point (only show on non-output nodes) */}
      {node.type !== 'output' && (
        <div 
          className={`absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white dark:bg-gray-800 border-2 border-green-400 rounded-full transition-all duration-200 cursor-crosshair ${
            isHovering || connectionInProgress ? 'opacity-100 scale-110' : 'opacity-70'
          }`}
          draggable
          onDragStart={(e) => {
            e.stopPropagation();
            handleDragStart(e as any);
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            handleConnectionStart(e, 'right');
          }}
          title="Drag to connect or click to start connection"
        />
      )}
    </div>
  );
};

export default Node;