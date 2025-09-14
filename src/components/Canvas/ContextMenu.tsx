import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Trash2, Copy, Edit } from 'lucide-react';
import { NodeData } from './Node';

interface ContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  node: NodeData | null;
  availableNodes: NodeData[];
  onClose: () => void;
  onConnectTo: (targetNodeId: string) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  isOpen,
  position,
  node,
  availableNodes,
  onClose,
  onConnectTo,
  onDelete,
  onDuplicate
}) => {
  const [showConnectSubmenu, setShowConnectSubmenu] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => {
      onClose();
      setShowConnectSubmenu(false);
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !node) return null;

  // Filter available nodes for connections
  const connectableNodes = availableNodes.filter(n => 
    n.id !== node.id && 
    // Basic connection rules: input nodes can connect to non-input, output nodes can receive from non-output
    ((node.type !== 'output' && n.type !== 'input') || 
     (node.type === 'input' && n.type !== 'input') ||
     (node.type !== 'output' && n.type === 'output'))
  );

  return (
    <AnimatePresence>
      <motion.div
        className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-2 min-w-48"
        style={{
          left: position.x,
          top: position.y,
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.1 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {node.label}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
            {node.type} node
          </div>
        </div>

        {/* Connect To submenu */}
        <div 
          className="relative px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center"
          onMouseEnter={() => setShowConnectSubmenu(true)}
          onMouseLeave={() => setShowConnectSubmenu(false)}
        >
          <Link className="w-4 h-4 mr-2 text-gray-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Connect to</span>
          <span className="ml-auto text-xs text-gray-400">▶</span>
          
          {/* Submenu */}
          <AnimatePresence>
            {showConnectSubmenu && (
              <motion.div
                className="absolute left-full top-0 ml-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-2 min-w-40 max-h-48 overflow-y-auto"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.1 }}
              >
                {connectableNodes.length > 0 ? (
                  connectableNodes.map((targetNode) => (
                    <div
                      key={targetNode.id}
                      className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => {
                        onConnectTo(targetNode.id);
                        onClose();
                      }}
                    >
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {targetNode.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {targetNode.type}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                    No connectable nodes
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

        {/* Duplicate */}
        <div 
          className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center"
          onClick={() => {
            onDuplicate();
            onClose();
          }}
        >
          <Copy className="w-4 h-4 mr-2 text-gray-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Duplicate</span>
        </div>

        {/* Delete */}
        <div 
          className="px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer flex items-center text-red-600 dark:text-red-400"
          onClick={() => {
            onDelete();
            onClose();
          }}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          <span className="text-sm">Delete</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ContextMenu;