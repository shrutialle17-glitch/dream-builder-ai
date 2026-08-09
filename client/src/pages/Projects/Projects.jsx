import { useState } from 'react';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from '../../hooks/useProjectQueries';
import { LayoutGrid, List, FolderKanban, Search, Filter } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';
import Input from '../../components/ui/Input';
import ProjectModal from './ProjectModal';
import Card, { CardBody } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';

export default function Projects() {
  const [viewMode, setViewMode] = useState('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  
  const { data, isLoading } = useProjects();
  const { mutate: createProject, isPending: isCreating } = useCreateProject();
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject(editingProject?.id);
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();

  const handleOpenModal = (project = null) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleSubmit = (formData) => {
    if (editingProject) {
      updateProject(formData, { onSuccess: () => setIsModalOpen(false) });
    } else {
      createProject(formData, { onSuccess: () => setIsModalOpen(false) });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(id);
    }
  };

  const projects = data?.projects || [];

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Industry', accessor: 'industry' },
    { header: 'Stage', accessor: 'startupStage' },
    { header: 'Status', render: (row) => <Badge variant={row.status === 'ACTIVE' ? 'success' : 'default'}>{row.status}</Badge> },
    { 
      header: 'Actions', 
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleOpenModal(row)} className="text-primary hover:underline text-sm font-medium">Edit</button>
          <button onClick={() => handleDelete(row.id)} className="text-danger hover:underline text-sm font-medium">Delete</button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Projects" 
        description="Manage your startup portfolio."
        action={{ label: 'New Project', onClick: () => handleOpenModal() }}
      />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2 flex-1">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 text-text-secondary" size={18} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button variant="secondary" className="gap-2">
            <Filter size={18} />
            <span className="hidden sm:inline">Filter</span>
          </Button>
        </div>
        <div className="flex items-center bg-surface border border-border rounded-xl p-1">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-text-primary'}`}
          >
            <LayoutGrid size={18} />
          </button>
          <button 
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-text-primary'}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState 
          icon={<FolderKanban size={48} />}
          title="No projects yet"
          description="Create your first project to start validating your ideas."
          action={{ label: 'Create Project', onClick: () => handleOpenModal() }}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <Card key={project.id} className="hover:border-primary/50 transition-colors">
              <CardBody className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant={project.status === 'ACTIVE' ? 'success' : 'default'}>{project.status}</Badge>
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenModal(project)} className="text-text-secondary hover:text-primary text-sm font-medium transition-colors">Edit</button>
                  </div>
                </div>
                <h3 className="text-lg font-display font-semibold text-text-primary">{project.name}</h3>
                <p className="text-sm text-text-secondary mt-2 flex-1 line-clamp-2">{project.description || 'No description provided.'}</p>
                
                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-text-secondary">
                  <span>{project.industry || 'No industry'}</span>
                  <span>{project.startupStage || 'No stage'}</span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <Table columns={columns} data={projects} />
        </Card>
      )}

      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSubmit}
        initialData={editingProject}
        isPending={isCreating || isUpdating}
      />
    </div>
  );
}
