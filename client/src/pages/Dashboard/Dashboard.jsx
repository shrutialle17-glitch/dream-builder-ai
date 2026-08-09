import { useAuth } from '../../context/AuthContext';
import { useProjects } from '../../hooks/useProjectQueries';
import { useActivities } from '../../hooks/useActivityQueries';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, LayoutDashboard, Clock, FolderKanban, Activity, ArrowRight, FolderOpen, Zap } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';

export default function Dashboard() {
  const { user } = useAuth();
  const { data: projectData, isLoading: isProjectsLoading } = useProjects({ limit: 5 });
  const { data: activityData, isLoading: isActivitiesLoading } = useActivities({ limit: 5 });
  const navigate = useNavigate();

  const totalProjects = projectData?.total || 0;
  const recentProjects = projectData?.projects || [];
  const recentActivities = activityData?.activities || [];
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader title="Recent Projects" />
          <CardBody className="p-0 flex-1 flex flex-col">
            {isProjectsLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : recentProjects.length === 0 ? (
              <div className="p-8 flex-1 flex flex-col justify-center">
                <EmptyState 
                  icon={<FolderOpen size={40} className="text-text-secondary mb-2" />}
                  title="No projects yet"
                  description="Create a project to start building your startup."
                  action={{ label: 'Create your first project', onClick: () => navigate('/projects?new=true') }}
                />
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentProjects.map(project => (
                  <div key={project.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-background/50 transition-colors gap-4">
                    <div>
                      <h4 className="font-medium text-text-primary hover:text-primary cursor-pointer transition-colors">{project.name}</h4>
                      <p className="text-sm text-text-secondary mt-1 line-clamp-1">{project.description || 'No description'}</p>
                    </div>
                    <div className="flex items-center gap-4 whitespace-nowrap">
                      <Badge variant={project.status === 'ACTIVE' ? 'success' : 'default'}>{project.status}</Badge>
                      <span className="text-xs text-text-secondary flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Quick Actions" />
            <CardBody className="space-y-3">
              <button 
                onClick={() => navigate('/projects?new=true')}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Plus size={18} />
                  </div>
                  <span className="font-medium text-text-primary group-hover:text-primary transition-colors">New Project</span>
                </div>
                <ArrowRight size={16} className="text-text-secondary group-hover:text-primary transition-colors" />
              </button>
              
              <Link 
                to="/projects"
                className="w-full flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-background rounded-lg text-text-primary">
                    <LayoutDashboard size={18} />
                  </div>
                  <span className="font-medium text-text-primary transition-colors">View All Projects</span>
                </div>
                <ArrowRight size={16} className="text-text-secondary transition-colors" />
              </Link>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Recent Activity" />
            <CardBody className="p-0">
              {isActivitiesLoading ? (
                <div className="p-4 space-y-4">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              ) : recentActivities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="p-3 bg-background rounded-full text-text-secondary mb-3">
                    <Activity size={20} />
                  </div>
                  <p className="text-sm text-text-secondary">No recent activity.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {recentActivities.map(activity => (
                    <div key={activity.id} className="p-4 hover:bg-background/50 transition-colors flex gap-3">
                      <div className="mt-1">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-text-primary">{activity.details}</p>
                        <p className="text-xs text-text-secondary mt-1">{new Date(activity.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
