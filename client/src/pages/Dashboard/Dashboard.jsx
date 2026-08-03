//import { useAuth } from '../../context/AuthContext';
import { useProjects } from '../../hooks/useProjectQueries';
import { useNavigate } from 'react-router-dom';
import { Clock, FolderKanban, Activity, Zap } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
export default function Dashboard() {
  //const { user } = useAuth();
  const user = {
    name: "Arya"
  };
  const navigate = useNavigate();
  const { data: projectData, isLoading: isProjectsLoading } = useProjects({ limit: 5 });
  const totalProjects = projectData?.total || 0;
  const recentProjects = projectData?.projects || [];
  const activeProjects = recentProjects.filter(p => p.status === 'ACTIVE').length || 0;
  

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.name || 'Entrepreneur'}!`}
        description="Here is what's happening with your startups today."
        action={{ label: 'New Project', onClick: () => navigate('/projects?new=true') }}
      />

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:border-primary/50 transition-colors">
          <CardBody className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                <FolderKanban size={20} />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm font-medium text-text-secondary">Total Projects</p>
              {isProjectsLoading ? <Skeleton className="h-8 w-16 mt-1" /> : <p className="text-2xl font-display font-bold text-text-primary">{totalProjects}</p>}
            </div>
          </CardBody>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardBody className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-success/10 rounded-xl text-success">
                <Activity size={20} />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm font-medium text-text-secondary">Active Projects</p>
              {isProjectsLoading ? <Skeleton className="h-8 w-16 mt-1" /> : <p className="text-2xl font-display font-bold text-text-primary">{activeProjects}</p>}
            </div>
          </CardBody>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardBody className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-500">
                <Zap size={20} />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm font-medium text-text-secondary">AI Credits</p>
              <p className="text-2xl font-display font-bold text-text-primary">1,250</p>
            </div>
          </CardBody>
        </Card>
        
        <Card className="hover:border-primary/50 transition-colors">
          <CardBody className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-500">
                <Clock size={20} />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm font-medium text-text-secondary">Avg Validation Time</p>
              <p className="text-2xl font-display font-bold text-text-primary">3.2 days</p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
