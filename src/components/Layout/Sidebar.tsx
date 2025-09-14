import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Package, Settings as SettingsIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NodePalette, { NodeType } from '../Sidebar/NodePalette';
import PropertiesPanel from '../Sidebar/PropertiesPanel';
import { NodeData } from '../Canvas/Node';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedNode?: NodeData | null;
  onNodeAdd?: (nodeType: NodeType['type'], position?: { x: number; y: number }) => void;
  onNodeUpdate?: (nodeId: string, updates: Partial<NodeData>) => void;
  onNodeDelete?: (nodeId: string) => void;
  onNodeDragStart?: (nodeType: NodeType) => void;
}

type ActiveTab = 'nodes' | 'properties';

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  selectedNode,
  onNodeAdd,
  onNodeUpdate,
  onNodeDelete,
  onNodeDragStart
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('nodes');

  const tabs = [
    {
      id: 'nodes' as const,
      label: 'Nodes',
      icon: Package,
      component: (
        <NodePalette 
          onNodeAdd={onNodeAdd}
          onNodeDragStart={onNodeDragStart}
        />
      )
    },
    {
      id: 'properties' as const,
      label: 'Properties',
      icon: SettingsIcon,
      component: (
        <PropertiesPanel
          selectedNode={selectedNode || null}
          onNodeUpdate={onNodeUpdate}
          onNodeDelete={onNodeDelete}
        />
      )
    }
  ];

  return (
    <div className="relative flex">
      {/* Sidebar Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full shadow-lg"
          >
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-900 border-b-2 border-primary-500'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">
              {tabs.find(tab => tab.id === activeTab)?.component}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <div className="relative">
        <motion.button
          onClick={onToggle}
          className={`absolute top-4 ${
            isOpen ? '-right-4' : 'left-4'
          } z-10 p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={false}
          animate={{ 
            x: isOpen ? 0 : 0,
            rotate: isOpen ? 0 : 0
          }}
        >
          {isOpen ? (
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default Sidebar;