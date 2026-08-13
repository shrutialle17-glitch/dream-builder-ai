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
import { FileEdit, Activity } from 'lucide-react';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { useNavigate } from 'react-router-dom';

export default function Projects() {
  const [viewMode, setViewMode] = useState('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  
  const { data, isLoading } = useProjects();
  const { mutate: createProject, isPending: isCreating } = useCreateProject();
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject(editingProject?.id);
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();
  const navigate = useNavigate();
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const handleOpenModal = (project = null) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleSubmit = (formData) => {
    if (editingProject) {
      updateProject(formData, { onSuccess: () => setIsModalOpen(false) });
    } else {
      createProject(formData, { 
        onSuccess: (newProject) => {
          setIsModalOpen(false);
          navigate(`/projects/${newProject.id}`);
        } 
      });
    }
  };

  const handleDeleteClick = (id) => {
    setProjectToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setProjectToDelete(null);
        }
      });
    }
  };

  const projects = data?.projects || [];

  const getProjectComputedStatus = (p) => {
    if (p.status === 'ACTIVE') return 'ACTIVE'; // If manually set
    const isActive = p.ideaValidation?.status === 'COMPLETED' ||
                     p.startupDNA?.status === 'COMPLETED' ||
                     !!p.businessPlan ||
                     !!p.mvpPlan ||
                     !!p.branding ||
                     !!p.pitchDeck ||
                     !!p.digitalTwin ||
                     !!p.marketResearch;
    return isActive ? 'ACTIVE' : 'DRAFT';
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Industry', accessor: 'industry' },
    { header: 'Stage', accessor: 'startupStage' },
    { 
      header: 'Status', 
      render: (row) => {
        const computedStatus = getProjectComputedStatus(row);
        return <Badge variant={computedStatus === 'ACTIVE' ? 'success' : 'default'}>{computedStatus}</Badge>;
      } 
    },
    { 
      header: 'Actions', 
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleOpenModal(row)} className="text-primary hover:underline text-sm font-medium">Edit</button>
          <button onClick={() => handleDeleteClick(row.id)} className="text-danger hover:underline text-sm font-medium">Delete</button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Startups" 
        description="Manage your startup portfolio."
        action={{ label: 'New Startup', onClick: () => handleOpenModal() }}
      />

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-5xl">
        <Card className="relative overflow-hidden group hover:shadow-lg hover:shadow-black/5 transition-all duration-200">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary/70"></div>
          <CardBody>
            <div className="flex items-start justify-between">
              <p className="text-[11px] font-semibold tracking-[0.15em] text-text-secondary uppercase">
                Total Startups
              </p>
              <FolderKanban size={16} className="text-text-secondary/60" />
            </div>
            {isLoading ? (
              <Skeleton className="h-9 w-16 mt-3" />
            ) : (
              <p className="mt-3 text-3xl font-display font-bold text-text-primary tabular-nums tracking-tight">
                {projects.length}
              </p>
            )}
          </CardBody>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg hover:shadow-black/5 transition-all duration-200">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-secondary/70"></div>
          <CardBody>
            <div className="flex items-start justify-between">
              <p className="text-[11px] font-semibold tracking-[0.15em] text-text-secondary uppercase">
                Drafts
              </p>
              <FileEdit size={16} className="text-text-secondary/60" />
            </div>
            {isLoading ? (
              <Skeleton className="h-9 w-16 mt-3" />
            ) : (
              <p className="mt-3 text-3xl font-display font-bold text-text-primary tabular-nums tracking-tight">
                {projects.filter(p => getProjectComputedStatus(p) === 'DRAFT').length}
              </p>
            )}
          </CardBody>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg hover:shadow-black/5 transition-all duration-200">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-success/70"></div>
          <CardBody>
            <div className="flex items-start justify-between">
              <p className="text-[11px] font-semibold tracking-[0.15em] text-text-secondary uppercase">
                In Progress
              </p>
              <Activity size={16} className="text-text-secondary/60" />
            </div>
            {isLoading ? (
              <Skeleton className="h-9 w-16 mt-3" />
            ) : (
              <p className="mt-3 text-3xl font-display font-bold text-text-primary tabular-nums tracking-tight">
                {projects.filter(p => getProjectComputedStatus(p) === 'ACTIVE').length}
              </p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2 flex-1">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 text-text-secondary" size={18} />
            <input 
              type="text" 
              placeholder="Search startups..." 
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
            aria-label="Grid View"
            className={`p-1.5 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-text-primary'}`}
          >
            <LayoutGrid size={18} aria-hidden="true" />
          </button>
          <button 
            onClick={() => setViewMode('table')}
            aria-label="Table View"
            className={`p-1.5 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${viewMode === 'table' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-text-primary'}`}
          >
            <List size={18} aria-hidden="true" />
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
          title="No startups yet"
          description="Create your first startup to start validating your ideas."
          action={{ label: 'Create Startup', onClick: () => handleOpenModal() }}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
          {projects.map(project => {
            const computedStatus = getProjectComputedStatus(project);
            return (
              <Card key={project.id} className="hover:border-primary/50 transition-colors">
                <CardBody className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant={computedStatus === 'ACTIVE' ? 'success' : 'default'}>{computedStatus}</Badge>
                    <div className="flex gap-2 items-center">
                    <button 
                      onClick={() => handleOpenModal(project)} 
                      className="text-xs px-3 py-1.5 rounded-full border border-border text-text-secondary hover:text-primary hover:border-primary/40 transition-colors font-medium"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => navigate(`/projects/${project.id}`)} 
                      className="text-xs px-3 py-1.5 rounded-full bg-primary text-background hover:bg-primary/90 transition-colors font-medium shadow-sm shadow-primary/20"
                    >
                      Open Workspace
                    </button>
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
            );
          })}
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
      
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Startup"
        message="Are you sure you want to delete this startup? All data, analysis, and models will be permanently lost."
        confirmText="Delete Startup"
        isDestructive={true}
        isPending={isDeleting}
      />
    </div>
  );
}
