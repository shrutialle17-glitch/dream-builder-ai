import { useState } from 'react';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from '../../hooks/useProjectQueries';
import { LayoutGrid, List, FolderKanban, Search, Filter, Pencil, Trash2, Building2, Briefcase } from 'lucide-react';
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
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="flex gap-2 flex-1">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full h-11 pl-10 pr-4 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-secondary hover:border-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          <Button variant="secondary" className="h-11 gap-2 shrink-0">
            <Filter size={16} />
            <span className="hidden sm:inline">Filter</span>
          </Button>
        </div>
        <div className="flex items-center bg-surface border border-border rounded-xl p-1 h-11 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-text-primary'}`}
          >
            <LayoutGrid size={17} />
          </button>
          <button
            onClick={() => setViewMode('table')}
            aria-label="Table view"
            className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-text-primary'}`}
          >
            <List size={17} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardBody className="py-4">
            <EmptyState
              icon={<FolderKanban size={48} className="text-text-secondary" />}
              title="No projects yet"
              description="Create your first project to start validating your ideas."
              action={{ label: 'Create Project', onClick: () => handleOpenModal() }}
            />
          </CardBody>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <Card
              key={project.id}
              className="relative overflow-hidden group hover:shadow-lg hover:shadow-black/5 hover:border-primary/40 transition-all duration-200"
            >
              <div className={`absolute top-0 left-0 right-0 h-[3px] ${project.status === 'ACTIVE' ? 'bg-success/70' : 'bg-border'}`}></div>
              <CardBody className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant={project.status === 'ACTIVE' ? 'success' : 'default'}>{project.status}</Badge>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenModal(project)}
                      aria-label="Edit project"
                      className="p-1.5 rounded-lg text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      disabled={isDeleting}
                      aria-label="Delete project"
                      className="p-1.5 rounded-lg text-text-secondary hover:text-danger hover:bg-danger/10 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-display font-semibold text-text-primary group-hover:text-primary transition-colors truncate">
                  {project.name}
                </h3>
                <p className="text-sm text-text-secondary mt-2 flex-1 line-clamp-2">
                  {project.description || 'No description provided.'}
                </p>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-text-secondary">
                  <span className="flex items-center gap-1.5 min-w-0">
                    <Building2 size={13} className="shrink-0" />
                    <span className="truncate">{project.industry || 'No industry'}</span>
                  </span>
                  <span className="flex items-center gap-1.5 shrink-0">
                    <Briefcase size={13} />
                    {project.startupStage || 'No stage'}
                  </span>
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