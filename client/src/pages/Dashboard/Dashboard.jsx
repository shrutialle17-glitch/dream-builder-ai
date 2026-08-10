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
  const activeShare = totalProjects > 0 ? Math.round((activeProjects / totalProjects) * 100) : 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${user?.name || 'Entrepreneur'}!`}
        description="Here is what's happening with your startups today."
        action={{ label: 'New Project', onClick: () => navigate('/projects?new=true') }}
      />

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="relative overflow-hidden group hover:shadow-lg hover:shadow-black/5 transition-all duration-200">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary/70"></div>
          <CardBody>
            <div className="flex items-start justify-between">
              <p className="text-[11px] font-semibold tracking-[0.15em] text-text-secondary uppercase">
                Total Projects
              </p>
              <FolderKanban size={16} className="text-text-secondary/60" />
            </div>
            {isProjectsLoading ? (
              <Skeleton className="h-9 w-16 mt-3" />
            ) : (
              <p className="mt-3 text-3xl font-display font-bold text-text-primary tabular-nums tracking-tight">
                {totalProjects}
              </p>
            )}
          </CardBody>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg hover:shadow-black/5 transition-all duration-200">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-success/70"></div>
          <CardBody>
            <div className="flex items-start justify-between">
              <p className="text-[11px] font-semibold tracking-[0.15em] text-text-secondary uppercase">
                Active Projects
              </p>
              <Activity size={16} className="text-text-secondary/60" />
            </div>
            {isProjectsLoading ? (
              <Skeleton className="h-9 w-16 mt-3" />
            ) : (
              <div className="mt-3 flex items-baseline gap-2">
                <p className="text-3xl font-display font-bold text-text-primary tabular-nums tracking-tight">
                  {activeProjects}
                </p>
                {totalProjects > 0 && (
                  <span className="text-xs font-medium text-success">{activeShare}% of total</span>
                )}
              </div>
            )}
          </CardBody>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg hover:shadow-black/5 transition-all duration-200">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-blue-500/70"></div>
          <CardBody>
            <div className="flex items-start justify-between">
              <p className="text-[11px] font-semibold tracking-[0.15em] text-text-secondary uppercase">
                AI Credits
              </p>
              <Zap size={16} className="text-text-secondary/60" />
            </div>
            <p className="mt-3 text-3xl font-display font-bold text-text-primary tabular-nums tracking-tight">
              1,250
            </p>
          </CardBody>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg hover:shadow-black/5 transition-all duration-200">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-purple-500/70"></div>
          <CardBody>
            <div className="flex items-start justify-between">
              <p className="text-[11px] font-semibold tracking-[0.15em] text-text-secondary uppercase">
                Avg Validation Time
              </p>
              <Clock size={16} className="text-text-secondary/60" />
            </div>
            <p className="mt-3 text-3xl font-display font-bold text-text-primary tabular-nums tracking-tight">
              3.2<span className="text-lg font-medium text-text-secondary ml-1">days</span>
            </p>
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
                  <div
                    key={project.id}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-background/50 transition-colors gap-4 group"
                  >
                    <div className="min-w-0">
                      <h4 className="font-medium text-text-primary group-hover:text-primary cursor-pointer transition-colors truncate">
                        {project.name}
                      </h4>
                      <p className="text-sm text-text-secondary mt-1 line-clamp-1">
                        {project.description || 'No description'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 whitespace-nowrap">
                      <Badge variant={project.status === 'ACTIVE' ? 'success' : 'default'}>{project.status}</Badge>
                      <span className="text-xs text-text-secondary flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </span>
                      <ArrowRight
                        size={14}
                        className="text-text-secondary/0 group-hover:text-text-secondary transition-colors hidden sm:block"
                      />
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
                className="w-full flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/[0.04] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary ring-1 ring-primary/10 group-hover:ring-primary/20 transition-all">
                    <Plus size={18} />
                  </div>
                  <span className="font-medium text-text-primary group-hover:text-primary transition-colors">New Project</span>
                </div>
                <ArrowRight size={16} className="text-text-secondary/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </button>

              <Link
                to="/projects"
                className="w-full flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/[0.04] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-background rounded-lg text-text-primary ring-1 ring-border group-hover:ring-primary/20 transition-all">
                    <LayoutDashboard size={18} />
                  </div>
                  <span className="font-medium text-text-primary group-hover:text-primary transition-colors">View All Projects</span>
                </div>
                <ArrowRight size={16} className="text-text-secondary/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
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
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="p-3 bg-background rounded-full text-text-secondary mb-3 ring-1 ring-border">
                    <Activity size={20} />
                  </div>
                  <p className="text-sm text-text-secondary">No recent activity.</p>
                </div>
              ) : (
                <div className="px-4 sm:px-5 py-2">
                  {recentActivities.map((activity, idx) => (
                    <div key={activity.id} className="relative flex gap-3 py-3.5">
                      {idx !== recentActivities.length - 1 && (
                        <div className="absolute left-[5px] top-5 bottom-0 w-px bg-border"></div>
                      )}
                      <div className="mt-1.5 relative z-10">
                        <div className="w-[11px] h-[11px] rounded-full bg-surface border-2 border-primary"></div>
                      </div>
                      <div className="flex-1 min-w-0 pb-0.5">
                        <p className="text-sm text-text-primary leading-snug">{activity.details}</p>
                        <p className="text-xs text-text-secondary mt-1">
                          {new Date(activity.createdAt).toLocaleString()}
                        </p>
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