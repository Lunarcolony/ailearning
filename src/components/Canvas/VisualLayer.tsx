import React, { useState, useRef, useEffect } from 'react';
import { Layer } from '../../types';

interface VisualLayerProps {
  layer: Layer;
  isSelected: boolean;
  onSelect: (layerId: string) => void;
  onMove: (layerId: string, x: number, y: number) => void;
  onResize: (layerId: string, width: number, height: number) => void;
  scale: number;
}

const VisualLayer: React.FC<VisualLayerProps> = ({
  layer,
  isSelected,
  onSelect,
  onMove,
  onResize,
  scale = 1
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });
  const layerRef = useRef<HTMLDivElement>(null);

  const visual = layer.visual;
  if (!visual?.visible) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(layer.id);
    
    // Only start dragging if clicking on the main layer area, not resize handles
    const target = e.target as HTMLElement;
    if (target === layerRef.current || target.closest('.layer-content')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setInitialPos({ x: visual.position.x, y: visual.position.y });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const deltaX = (e.clientX - dragStart.x) / scale;
      const deltaY = (e.clientY - dragStart.y) / scale;
      onMove(layer.id, initialPos.x + deltaX, initialPos.y + deltaY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, initialPos, scale]);

  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    setIsResizing(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      ref={layerRef}
      className={`absolute border-2 cursor-move select-none ${
        isSelected ? 'border-blue-400' : 'border-gray-300'
      }`}
      style={{
        left: visual.position.x,
        top: visual.position.y,
        width: visual.dimensions.width,
        height: visual.dimensions.height,
        backgroundColor: visual.color,
        opacity: visual.opacity,
        zIndex: visual.zIndex,
        borderStyle: 'dashed',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Main layer content area */}
      <div className="layer-content w-full h-full">
        {/* Layer Label */}
        <div
          className="absolute -top-6 left-0 bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs font-medium shadow-sm border border-gray-200 dark:border-gray-600 pointer-events-none"
          style={{ opacity: 1 }}
        >
          {layer.name}
        </div>

        {/* Node count indicator */}
        <div className="absolute bottom-2 right-2 text-xs opacity-70 pointer-events-none">
          {layer.nodeIds.length} nodes
        </div>
      </div>

      {/* Resize Handles - Only show when selected */}
      {isSelected && (
        <>
          {/* Corner handles */}
          <div
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-400 cursor-nw-resize z-10"
            onMouseDown={(e) => handleResizeStart(e, 'se')}
          />
          <div
            className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 cursor-ne-resize z-10"
            onMouseDown={(e) => handleResizeStart(e, 'ne')}
          />
          <div
            className="absolute -top-1 -left-1 w-3 h-3 bg-blue-400 cursor-nw-resize z-10"
            onMouseDown={(e) => handleResizeStart(e, 'nw')}
          />
          <div
            className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-400 cursor-sw-resize z-10"
            onMouseDown={(e) => handleResizeStart(e, 'sw')}
          />

          {/* Edge handles */}
          <div
            className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-400 cursor-n-resize z-10"
            onMouseDown={(e) => handleResizeStart(e, 'n')}
          />
          <div
            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-400 cursor-s-resize z-10"
            onMouseDown={(e) => handleResizeStart(e, 's')}
          />
          <div
            className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-400 cursor-w-resize z-10"
            onMouseDown={(e) => handleResizeStart(e, 'w')}
          />
          <div
            className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-400 cursor-e-resize z-10"
            onMouseDown={(e) => handleResizeStart(e, 'e')}
          />
        </>
      )}
    </div>
  );
};

export default VisualLayer;