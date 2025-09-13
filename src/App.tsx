import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ThemeProvider from './components/Common/ThemeProvider';
import Home from './pages/Home';
import Workspace from './pages/Workspace';
import Tutorials from './pages/Tutorials';
import Settings from './pages/Settings';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/tutorials" element={<Tutorials />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;