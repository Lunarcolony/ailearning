import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Download, 
  Palette, 
  Grid, 
  Save,
  Moon,
  Sun,
  Monitor,
  CheckCircle,
  FileCode,
  Settings as SettingsIcon
} from 'lucide-react';
import MainLayout from '../components/Layout/MainLayout';

const Settings: React.FC = () => {
  const [selectedFramework, setSelectedFramework] = useState('tensorflow');
  const [exportFormat, setExportFormat] = useState('script');
  const [theme, setTheme] = useState('system');
  const [gridSize, setGridSize] = useState(20);
  const [showGrid, setShowGrid] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  const frameworks = [
    {
      id: 'tensorflow',
      name: 'TensorFlow/Keras',
      description: 'High-level API for production deployment',
      icon: '🔥'
    },
    {
      id: 'pytorch',
      name: 'PyTorch',
      description: 'Dynamic computation graphs for research',
      icon: '⚡'
    },
    {
      id: 'numpy',
      name: 'Pure Python + NumPy',
      description: 'Educational implementation with minimal dependencies',
      icon: '🐍'
    }
  ];

  const exportFormats = [
    {
      id: 'script',
      name: 'Python Script (.py)',
      description: 'Standalone Python file ready to run'
    },
    {
      id: 'notebook',
      name: 'Jupyter Notebook (.ipynb)',
      description: 'Interactive notebook with explanations'
    },
    {
      id: 'module',
      name: 'Python Module',
      description: 'Structured module for integration'
    }
  ];

  const themeOptions = [
    { id: 'light', name: 'Light', icon: Sun },
    { id: 'dark', name: 'Dark', icon: Moon },
    { id: 'system', name: 'System', icon: Monitor }
  ];

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center mb-4">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <SettingsIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white ml-3">
              Settings
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Customize your Neural Designer experience and export preferences.
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Code Export Settings */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 card-shadow"
          >
            <div className="flex items-center mb-6">
              <Code className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Code Export
              </h2>
            </div>

            {/* Framework Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Preferred Framework
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {frameworks.map((framework) => (
                  <label
                    key={framework.id}
                    className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedFramework === framework.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="framework"
                      value={framework.id}
                      checked={selectedFramework === framework.id}
                      onChange={(e) => setSelectedFramework(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center mb-2">
                      <span className="text-xl mr-2">{framework.icon}</span>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {framework.name}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {framework.description}
                    </p>
                    {selectedFramework === framework.id && (
                      <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-primary-500" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Export Format */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Export Format
              </h3>
              <div className="space-y-3">
                {exportFormats.map((format) => (
                  <label
                    key={format.id}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                      exportFormat === format.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="exportFormat"
                      value={format.id}
                      checked={exportFormat === format.id}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="sr-only"
                    />
                    <FileCode className="w-5 h-5 text-gray-400 mr-3" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {format.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {format.description}
                      </p>
                    </div>
                    {exportFormat === format.id && (
                      <CheckCircle className="w-5 h-5 text-primary-500" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Export Preview Button */}
            <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Preview Export (Coming Soon)
            </button>
          </motion.section>

          {/* UI Preferences */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 card-shadow"
          >
            <div className="flex items-center mb-6">
              <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Interface
              </h2>
            </div>

            {/* Theme Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Theme
              </h3>
              <div className="flex gap-3">
                {themeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setTheme(option.id)}
                    className={`flex items-center px-4 py-2 rounded-lg border transition-all ${
                      theme === option.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <option.icon className="w-4 h-4 mr-2" />
                    {option.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid Settings */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Workspace Grid
              </h3>
              
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600 text-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    Show grid lines
                  </span>
                </label>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Grid size: {gridSize}px
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={gridSize}
                    onChange={(e) => setGridSize(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>10px</span>
                    <span>50px</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* General Settings */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 card-shadow"
          >
            <div className="flex items-center mb-6">
              <Save className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                General
              </h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <span className="text-gray-900 dark:text-white font-medium">
                    Auto-save projects
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Automatically save your work every few minutes
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600 text-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </label>
            </div>
          </motion.section>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-end"
          >
            <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
              Save Settings
            </button>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;