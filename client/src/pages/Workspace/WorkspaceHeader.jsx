import React, { useState } from 'react';
import { Settings, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../../components/common/ThemeToggle';
import UserProfileDropdown from '../../components/common/UserProfileDropdown';
import ProjectModal from '../Projects/ProjectModal';
import { useUpdateProject } from '../../hooks/useProjectQueries';

const WorkspaceHeader = ({ project, toggleSidebar }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject(project.id);

  const handleUpdate = (formData) => {
    updateProject(formData, {
      onSuccess: () => setIsEditModalOpen(false)
    });
  };

  return (
    <>
      <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-4 lg:px-10 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <button className="lg:hidden text-text-primary focus:outline-none mr-2" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
          <Link to="/projects" className="hidden sm:inline text-text-secondary hover:text-text-primary transition-colors">My Startups</Link>
          <span className="hidden sm:inline text-text-secondary">/</span>
          <span className="text-text-primary font-medium truncate max-w-[150px] sm:max-w-xs">{project.name}</span>
          <span className="text-text-secondary">/</span>
          <span className="text-text-secondary">Workspace</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium border border-success/20 mr-2">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
            AI Online
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs mr-2">
            {project.industry && (
              <span className="px-2 py-0.5 rounded bg-surface border border-border text-text-secondary">
                {project.industry}
              </span>
            )}
            {project.startupStage && (
              <span className="px-2 py-0.5 rounded bg-secondary/10 border border-secondary/20 text-secondary font-medium">
                {project.startupStage}
              </span>
            )}
          </div>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-md border border-border text-sm text-text-secondary hover:text-text-primary hover:border-text-secondary transition-colors mr-1 sm:mr-2"
          >
            <Settings size={16} />
            <span className="hidden sm:inline">Edit Startup</span>
          </button>

          <div className="w-px h-6 bg-border mx-1 hidden sm:block"></div>
          <ThemeToggle />
          <UserProfileDropdown />
        </div>
      </header>

      <ProjectModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdate}
        initialData={project}
        isPending={isUpdating}
      />
    </>
  );
};

export default WorkspaceHeader;
