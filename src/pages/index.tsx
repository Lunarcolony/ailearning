import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Workspace from './Workspace';
import Tutorials from './Tutorials';
import Settings from './Settings';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/tutorials" element={<Tutorials />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
};

export default App;