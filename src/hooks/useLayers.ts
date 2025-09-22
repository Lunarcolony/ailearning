import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { 
  addLayer, 
  updateLayer, 
  removeLayer, 
  selectLayer, 
  deselectLayer, 
  clearLayerSelection,
  moveLayer,
  resizeLayer,
  toggleLayerVisibility
} from '../store/slices/workspaceSlice.enhanced';
import { Layer, Position, Dimensions, UseLayersReturn } from '../types';

export const useLayers = (): UseLayersReturn => {
  const dispatch = useDispatch();
  
  const layers = useSelector((state: RootState) => {
    const workspace = state.workspace;
    return Object.values(workspace.layers);
  });

  const selectedLayerIds = useSelector((state: RootState) => {
    return state.workspace.selectedItems.layerIds;
  });

  const selectedLayers = layers.filter(layer => selectedLayerIds.includes(layer.id));

  const handleAddLayer = (layerData: Omit<Layer, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch(addLayer(layerData));
  };

  const handleUpdateLayer = (id: string, updates: Partial<Layer>) => {
    dispatch(updateLayer({ id, updates }));
  };

  const handleRemoveLayer = (id: string) => {
    dispatch(removeLayer(id));
  };

  const handleSelectLayer = (id: string, addToSelection = false) => {
    dispatch(selectLayer({ layerId: id, addToSelection }));
  };

  const handleDeselectLayer = (id: string) => {
    dispatch(deselectLayer(id));
  };

  const handleClearSelection = () => {
    dispatch(clearLayerSelection());
  };

  const handleMoveLayer = (id: string, position: Position) => {
    dispatch(moveLayer({ layerId: id, position }));
  };

  const handleResizeLayer = (id: string, dimensions: Dimensions) => {
    dispatch(resizeLayer({ layerId: id, dimensions }));
  };

  const handleToggleLayerVisibility = (id: string) => {
    dispatch(toggleLayerVisibility(id));
  };

  const handleAssignNodeToLayer = (nodeId: string, layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer && !layer.nodeIds.includes(nodeId)) {
      handleUpdateLayer(layerId, {
        nodeIds: [...layer.nodeIds, nodeId]
      });
    }
  };

  const handleRemoveNodeFromLayer = (nodeId: string, layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer) {
      handleUpdateLayer(layerId, {
        nodeIds: layer.nodeIds.filter(id => id !== nodeId)
      });
    }
  };

  return {
    layers,
    selectedLayers,
    addLayer: handleAddLayer,
    updateLayer: handleUpdateLayer,
    removeLayer: handleRemoveLayer,
    selectLayer: handleSelectLayer,
    deselectLayer: handleDeselectLayer,
    clearSelection: handleClearSelection,
    moveLayer: handleMoveLayer,
    resizeLayer: handleResizeLayer,
    toggleLayerVisibility: handleToggleLayerVisibility,
    assignNodeToLayer: handleAssignNodeToLayer,
    removeNodeFromLayer: handleRemoveNodeFromLayer,
  };
};