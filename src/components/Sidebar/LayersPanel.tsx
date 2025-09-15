import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { 
  addLayer, 
  removeLayer, 
  updateLayer, 
  setActiveLayer, 
  toggleLayerVisibility,
  moveSelectedNodesToLayer,
  Layer 
} from '../../store/slices/nodesSlice';
import { Plus, Eye, EyeOff, Edit3, Trash2, Palette, ChevronUp, ChevronDown } from 'lucide-react';

const LayersPanel: React.FC = () => {
  const dispatch = useDispatch();
  const { layers, activeLayerId, nodes, selectedNodeIds } = useSelector((state: RootState) => state.nodes);
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);

  const predefinedColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#F97316', '#06B6D4', '#84CC16',
    '#EC4899', '#6B7280', '#1F2937', '#7C2D12'
  ];

  const handleAddLayer = () => {
    const newLayer = {
      name: `Layer ${layers.length + 1}`,
      visible: true,
      color: predefinedColors[layers.length % predefinedColors.length],
      order: layers.length
    };
    dispatch(addLayer(newLayer));
  };

  const handleDeleteLayer = (layerId: string) => {
    if (layerId === 'default') return;
    dispatch(removeLayer(layerId));
  };

  const handleToggleVisibility = (layerId: string) => {
    dispatch(toggleLayerVisibility(layerId));
  };

  const handleSetActiveLayer = (layerId: string) => {
    dispatch(setActiveLayer(layerId));
  };

  const handleStartEdit = (layer: Layer) => {
    setEditingLayerId(layer.id);
    setEditingName(layer.name);
  };

  const handleSaveEdit = () => {
    if (editingLayerId && editingName.trim()) {
      dispatch(updateLayer({ 
        id: editingLayerId, 
        updates: { name: editingName.trim() } 
      }));
    }
    setEditingLayerId(null);
    setEditingName('');
  };

  const handleCancelEdit = () => {
    setEditingLayerId(null);
    setEditingName('');
  };

  const handleColorChange = (layerId: string, color: string) => {
    dispatch(updateLayer({ id: layerId, updates: { color } }));
    setShowColorPicker(null);
  };

  const handleMoveSelectedToLayer = (layerId: string) => {
    dispatch(moveSelectedNodesToLayer(layerId));
  };

  const getNodeCountInLayer = (layerId: string) => {
    return nodes.filter(node => node.layerId === layerId).length;
  };

  const getVisibleNodeCountInLayer = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (!layer?.visible) return 0;
    return getNodeCountInLayer(layerId);
  };

  const sortedLayers = [...layers].sort((a, b) => a.order - b.order);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">Layers</h3>
        <button
          onClick={handleAddLayer}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
          title="Add Layer"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sortedLayers.map((layer) => (
          <div
            key={layer.id}
            className={`border-b border-gray-200 dark:border-gray-700 ${
              layer.id === activeLayerId ? 'bg-blue-50 dark:bg-blue-900/20' : ''
            }`}
          >
            <div className="p-3 flex items-center gap-2">
              {/* Visibility Toggle */}
              <button
                onClick={() => handleToggleVisibility(layer.id)}
                className={`p-1 rounded ${
                  layer.visible 
                    ? 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800' 
                    : 'text-gray-400 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                title={layer.visible ? 'Hide Layer' : 'Show Layer'}
              >
                {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>

              {/* Layer Color */}
              <div className="relative">
                <button
                  onClick={() => setShowColorPicker(showColorPicker === layer.id ? null : layer.id)}
                  className="w-4 h-4 rounded border border-gray-300 dark:border-gray-600"
                  style={{ backgroundColor: layer.color }}
                  title="Change Color"
                />
                {showColorPicker === layer.id && (
                  <div className="absolute top-6 left-0 z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2">
                    <div className="grid grid-cols-4 gap-1">
                      {predefinedColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => handleColorChange(layer.id, color)}
                          className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Layer Name */}
              <div className="flex-1 min-w-0">
                {editingLayerId === layer.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit();
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                      onBlur={handleSaveEdit}
                      className="flex-1 px-1 py-0.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                      autoFocus
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => handleSetActiveLayer(layer.id)}
                    className={`text-left w-full truncate text-sm ${
                      layer.id === activeLayerId 
                        ? 'text-blue-600 dark:text-blue-400 font-medium' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                    title="Set as Active Layer"
                  >
                    {layer.name}
                  </button>
                )}
              </div>

              {/* Node Count */}
              <span className="text-xs text-gray-500 dark:text-gray-400 min-w-0">
                {getVisibleNodeCountInLayer(layer.id)}/{getNodeCountInLayer(layer.id)}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1">
                {layer.id !== 'default' && (
                  <button
                    onClick={() => handleStartEdit(layer)}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                    title="Rename Layer"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                )}
                {layer.id !== 'default' && (
                  <button
                    onClick={() => handleDeleteLayer(layer.id)}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-red-600"
                    title="Delete Layer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Move Selected Nodes to Layer */}
            {selectedNodeIds.length > 0 && layer.id !== activeLayerId && (
              <div className="px-3 pb-2">
                <button
                  onClick={() => handleMoveSelectedToLayer(layer.id)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Move {selectedNodeIds.length} selected node{selectedNodeIds.length > 1 ? 's' : ''} here
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Layer Instructions */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <div>• Click layer name to set as active</div>
          <div>• New nodes go to active layer</div>
          <div>• Toggle eye to show/hide layer</div>
          {selectedNodeIds.length > 0 && (
            <div className="text-blue-600 dark:text-blue-400">
              • {selectedNodeIds.length} node{selectedNodeIds.length > 1 ? 's' : ''} selected
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LayersPanel;