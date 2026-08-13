import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import WorkspaceSidebar from './WorkspaceSidebar';
import WorkspaceHeader from './WorkspaceHeader';
import { useProject } from '../../hooks/useProjectQueries';
import { useParams } from 'react-router-dom';

const WorkspaceLayout = () => {
  const { projectId } = useParams();
  const { data: project, isLoading, error } = useProject(projectId);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-text-primary">Loading Startup Workspace...</div>;
  }

  if (error || !project) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-danger">Startup not found or unauthorized.</div>;
  }

  return (
    <div className="flex h-screen bg-background text-text-primary font-sans overflow-hidden">
      <WorkspaceSidebar project={project} isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <WorkspaceHeader project={project} toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10">
          <Outlet context={{ project }} />
        </main>
      </div>
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={toggleSidebar}></div>
      )}
    </div>
  );
};

export default WorkspaceLayout;
