import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Play, 
  Code, 
  Brain, 
  Layers,
  ArrowRight,
  Clock,
  Users,
  Star
} from 'lucide-react';
import MainLayout from '../components/Layout/MainLayout';

const Tutorials: React.FC = () => {
  const tutorials = [
    {
      id: 1,
      title: 'Getting Started with Neural Designer',
      description: 'Learn the basics of the visual neural network builder interface.',
      duration: '15 min',
      level: 'Beginner',
      icon: BookOpen,
      color: 'bg-green-500',
      topics: ['Interface Overview', 'Creating Nodes', 'Basic Navigation']
    },
    {
      id: 2,
      title: 'Building Your First Neural Network',
      description: 'Create a simple feedforward network for image classification.',
      duration: '25 min',
      level: 'Beginner',
      icon: Brain,
      color: 'bg-blue-500',
      topics: ['Input Layers', 'Hidden Layers', 'Output Layers', 'Activation Functions']
    },
    {
      id: 3,
      title: 'Understanding Activation Functions',
      description: 'Explore different activation functions and their use cases.',
      duration: '20 min',
      level: 'Intermediate',
      icon: Play,
      color: 'bg-purple-500',
      topics: ['ReLU', 'Sigmoid', 'Tanh', 'Softmax', 'Custom Functions']
    },
    {
      id: 4,
      title: 'Convolutional Neural Networks',
      description: 'Design CNNs for computer vision tasks.',
      duration: '35 min',
      level: 'Intermediate',
      icon: Layers,
      color: 'bg-orange-500',
      topics: ['Conv Layers', 'Pooling', 'Feature Maps', 'CNN Architectures']
    },
    {
      id: 5,
      title: 'Code Export and Deployment',
      description: 'Export your designs to TensorFlow, PyTorch, or pure Python.',
      duration: '30 min',
      level: 'Advanced',
      icon: Code,
      color: 'bg-red-500',
      topics: ['Code Generation', 'Framework Selection', 'Deployment Options']
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'Advanced': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Learn Neural Network Design
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Master the art of visual neural network design with our comprehensive tutorials 
            and interactive examples.
          </p>
        </motion.div>

        {/* Quick Start Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl p-8 mb-12 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Ready to Start Building?</h2>
              <p className="text-primary-100 mb-4">
                Jump straight into the workspace and start creating your first neural network.
              </p>
            </div>
            <Link
              to="/workspace"
              className="inline-flex items-center px-6 py-3 bg-white text-primary-600 font-medium rounded-lg hover:bg-gray-100 transition-colors group"
            >
              Open Workspace
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Tutorials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
          {tutorials.map((tutorial, index) => (
            <motion.div
              key={tutorial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl card-shadow hover:card-shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
            >
              <div className="p-6">
                {/* Tutorial Header */}
                <div className="flex items-center mb-4">
                  <div className={`p-3 ${tutorial.color} rounded-lg`}>
                    <tutorial.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {tutorial.title}
                    </h3>
                  </div>
                </div>

                {/* Tutorial Meta */}
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(tutorial.level)}`}>
                    {tutorial.level}
                  </span>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    {tutorial.duration}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {tutorial.description}
                </p>

                {/* Topics */}
                <div className="space-y-2 mb-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    What you'll learn:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {tutorial.topics.map((topic, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors flex items-center justify-center">
                  Start Tutorial
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Community */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 card-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white ml-3">
                Join the Community
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Connect with other neural network designers, share your creations, 
              and get help from the community.
            </p>
            <a
              href="https://github.com/Lunarcolony/ailearning"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              Visit GitHub
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>

          {/* Examples */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 card-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white ml-3">
                Example Networks
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Explore pre-built neural network architectures and learn from 
              real-world examples.
            </p>
            <button className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium">
              Browse Examples
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Tutorials;