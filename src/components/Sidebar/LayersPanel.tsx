import React, { useState } from 'react';
import { Plus, Eye, EyeOff, Trash2, Settings, Move, Square } from 'lucide-react';
import { Layer } from '../../types';

interface LayersPanelProps {
  layers: Layer[];
  selectedLayerIds: string[];
  onLayerAdd: () => void;
  onLayerSelect: (layerId: string, addToSelection?: boolean) => void;
  onLayerUpdate: (layerId: string, updates: Partial<Layer>) => void;
  onLayerDelete: (layerId: string) => void;
  onLayerToggleVisibility: (layerId: string) => void;
}

const LayersPanel: React.FC<LayersPanelProps> = ({
  layers,
  selectedLayerIds,
  onLayerAdd,
  onLayerSelect,
  onLayerUpdate,
  onLayerDelete,
  onLayerToggleVisibility,
}) => {
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(new Set());

  const defaultColors = [
    '#3b82f6', // blue
    '#10b981', // emerald
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // violet
    '#06b6d4', // cyan
    '#84cc16', // lime
    '#f97316', // orange
  ];

  const handleCreateLayer = () => {
    onLayerAdd();
  };

  const handleLayerClick = (layerId: string, e: React.MouseEvent) => {
    const addToSelection = e.ctrlKey || e.metaKey;
    onLayerSelect(layerId, addToSelection);
  };

  const toggleLayerExpanded = (layerId: string) => {
    const newExpanded = new Set(expandedLayers);
    if (newExpanded.has(layerId)) {
      newExpanded.delete(layerId);
    } else {
      newExpanded.add(layerId);
    }
    setExpandedLayers(newExpanded);
  };

  const handleColorChange = (layerId: string, color: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer?.visual) {
      onLayerUpdate(layerId, {
        visual: {
          ...layer.visual,
          color,
        },
      });
    }
  };

  const handleOpacityChange = (layerId: string, opacity: number) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer?.visual) {
      onLayerUpdate(layerId, {
        visual: {
          ...layer.visual,
          opacity: opacity / 100,
        },
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Layers
        </h3>
        <button
          onClick={handleCreateLayer}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          title="Add Layer"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Layers List */}
      <div className="flex-1 overflow-y-auto">
        {layers.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            <Square className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No layers created yet</p>
            <p className="text-xs mt-1">Click + to add your first layer</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {layers.map((layer) => {
              const isSelected = selectedLayerIds.includes(layer.id);
              const isExpanded = expandedLayers.has(layer.id);
              const visual = layer.visual;

              return (
                <div
                  key={layer.id}
                  className={`rounded-lg border transition-all ${
                    isSelected
                      ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {/* Layer Header */}
                  <div
                    className="flex items-center p-3 cursor-pointer"
                    onClick={(e) => handleLayerClick(layer.id, e)}
                  >
                    <div
                      className="w-4 h-4 rounded border-2 mr-3 flex-shrink-0"
                      style={{
                        backgroundColor: visual?.color || '#3b82f6',
                        opacity: visual?.opacity || 0.3,
                        borderColor: visual?.color || '#3b82f6',
                      }}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {layer.name}
                        </span>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onLayerToggleVisibility(layer.id);
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            title={visual?.visible ? 'Hide Layer' : 'Show Layer'}
                          >
                            {visual?.visible ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLayerExpanded(layer.id);
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            title="Layer Settings"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onLayerDelete(layer.id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                            title="Delete Layer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {layer.nodeIds.length} nodes • {layer.type}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Settings */}
                  {isExpanded && (
                    <div className="px-3 pb-3 border-t border-gray-100 dark:border-gray-800">
                      <div className="space-y-3 mt-3">
                        {/* Color Picker */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Color
                          </label>
                          <div className="flex flex-wrap gap-1">
                            {defaultColors.map((color) => (
                              <button
                                key={color}
                                onClick={() => handleColorChange(layer.id, color)}
                                className={`w-6 h-6 rounded border-2 ${
                                  visual?.color === color
                                    ? 'border-gray-400'
                                    : 'border-gray-200 dark:border-gray-600'
                                }`}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Opacity Slider */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Opacity: {Math.round((visual?.opacity || 0.3) * 100)}%
                          </label>
                          <input
                            type="range"
                            min="10"
                            max="80"
                            value={Math.round((visual?.opacity || 0.3) * 100)}
                            onChange={(e) => handleOpacityChange(layer.id, parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        {/* Layer Name */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            value={layer.name}
                            onChange={(e) => onLayerUpdate(layer.id, { name: e.target.value })}
                            className="w-full px-2 py-1 text-xs border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LayersPanel;