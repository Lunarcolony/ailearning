import { useState, useRef, useCallback } from 'react';

interface CanvasState {
  scale: number;
  offsetX: number;
  offsetY: number;
  isDragging: boolean;
}

interface UseCanvasReturn {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  canvasState: CanvasState;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: () => void;
  handleWheel: (e: React.WheelEvent) => void;
  resetCanvas: () => void;
}

export const useCanvas = (): UseCanvasReturn => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasState, setCanvasState] = useState<CanvasState>({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    isDragging: false
  });

  const handleMouseDown = useCallback((_e: React.MouseEvent) => {
    setCanvasState(prev => ({ ...prev, isDragging: true }));
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!canvasState.isDragging) return;
    
    setCanvasState(prev => ({
      ...prev,
      offsetX: prev.offsetX + e.movementX,
      offsetY: prev.offsetY + e.movementY
    }));
  }, [canvasState.isDragging]);

  const handleMouseUp = useCallback(() => {
    setCanvasState(prev => ({ ...prev, isDragging: false }));
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setCanvasState(prev => ({
      ...prev,
      scale: Math.min(Math.max(prev.scale * delta, 0.1), 5)
    }));
  }, []);

  const resetCanvas = useCallback(() => {
    setCanvasState({
      scale: 1,
      offsetX: 0,
      offsetY: 0,
      isDragging: false
    });
  }, []);

  return {
    canvasRef,
    canvasState,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    resetCanvas
  };
};