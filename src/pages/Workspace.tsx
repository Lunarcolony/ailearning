import React from 'react';
import MainLayout from '../components/Layout/MainLayout';
import WorkspaceCanvas from '../components/Canvas/WorkspaceCanvas';

const Workspace: React.FC = () => {
  return (
    <MainLayout className="p-0">
      <div className="flex h-screen">
        {/* Main Canvas Area */}
        <div className="flex-1 relative">
          <WorkspaceCanvas />
        </div>
      </div>
    </MainLayout>
  );
};

export default Workspace;