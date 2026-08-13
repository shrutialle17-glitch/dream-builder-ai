import { useAuth } from '../../context/AuthContext';
import { useProjects } from '../../hooks/useProjectQueries';
import { useActivities } from '../../hooks/useActivityQueries';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, LayoutDashboard, Clock, FolderKanban, Activity, ArrowRight, FolderOpen, Zap, Lightbulb, Dna, FileText, Box, Paintbrush, Presentation, MonitorPlay, Search } from 'lucide-react';
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
  const activeProjects = recentProjects.filter(p => {
    return (p.ideaValidation?.status === 'COMPLETED' ||
            p.startupDNA?.status === 'COMPLETED' ||
            !!p.businessPlan ||
            !!p.mvpPlan ||
            !!p.branding ||
            !!p.pitchDeck ||
            !!p.digitalTwin ||
            !!p.marketResearch);
  }).length || 0;
  const activeShare = totalProjects > 0 ? Math.round((activeProjects / totalProjects) * 100) : 0;

  const getActivityConfig = (activity) => {
    const projectName = activity.project?.name || 'a project';
    if (activity.action.includes('PROJECT')) {
      return { icon: <FolderKanban size={14} />, text: activity.details || `Updated project: ${projectName}` };
    }
    switch (activity.action) {
      case 'GENERATED_IDEA_VALIDATION': return { icon: <Lightbulb size={14} />, text: `Generated Idea Validation for ${projectName}` };
      case 'GENERATED_STARTUP_DNA': return { icon: <Dna size={14} />, text: `Generated Startup DNA for ${projectName}` };
      case 'GENERATED_BUSINESS_PLAN': return { icon: <FileText size={14} />, text: `Generated Business Plan for ${projectName}` };
      case 'GENERATED_MVP_PLAN': return { icon: <Box size={14} />, text: `Generated MVP Plan for ${projectName}` };
      case 'GENERATED_BRANDING': return { icon: <Paintbrush size={14} />, text: `Generated Brand Studio for ${projectName}` };
      case 'GENERATED_PITCH_DECK': return { icon: <Presentation size={14} />, text: `Generated Pitch Deck for ${projectName}` };
      case 'SIMULATED_DIGITAL_TWIN': return { icon: <MonitorPlay size={14} />, text: `Ran Digital Twin simulation for ${projectName}` };
      case 'GENERATED_MARKET_RESEARCH': return { icon: <Search size={14} />, text: `Generated Market Research for ${projectName}` };
      default: return { icon: <Activity size={14} />, text: activity.details || `Performed an action on ${projectName}` };
    }
  };

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

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${user?.name || 'Entrepreneur'}!`}
        description="Here is what's happening with your startups today."
        action={{ label: 'New Startup', onClick: () => navigate('/projects?new=true') }}
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
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-secondary/70"></div>
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
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-warning/70"></div>
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
                {recentProjects.map(project => {
                  const computedStatus = getProjectComputedStatus(project);
                  return (
                    <div
                      key={project.id}
                      onClick={() => navigate(`/projects/${project.id}`)}
                      className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-background/50 transition-colors gap-4 group cursor-pointer"
                    >
                      <div className="min-w-0">
                        <h4 className="font-medium text-text-primary group-hover:text-primary transition-colors truncate">
                          {project.name}
                        </h4>
                        <p className="text-sm text-text-secondary mt-1 line-clamp-1">
                          {project.description || 'No description'}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 whitespace-nowrap">
                        <Badge variant={computedStatus === 'ACTIVE' ? 'success' : 'default'}>{computedStatus}</Badge>
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
                  );
                })}
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
                  <span className="font-medium text-text-primary group-hover:text-primary transition-colors">New Startup</span>
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
                <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                  <div className="p-4 bg-background rounded-full text-text-secondary mb-4 ring-1 ring-border">
                    <Activity size={24} />
                  </div>
                  <h4 className="text-text-primary font-medium mb-1">No activity recorded</h4>
                  <p className="text-sm text-text-secondary mb-4">You haven't generated any insights yet.</p>
                  <button 
                    onClick={() => navigate('/projects?new=true')}
                    className="text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    Start your first project
                  </button>
                </div>
              ) : (
                <div className="px-4 sm:px-5 py-2">
                  {recentActivities.map((activity, idx) => {
                    const { icon, text } = getActivityConfig(activity);
                    return (
                      <div key={activity.id} className="relative flex gap-4 py-3.5">
                        {idx !== recentActivities.length - 1 && (
                          <div className="absolute left-[13px] top-8 bottom-[-10px] w-px bg-border"></div>
                        )}
                        <div className="mt-0.5 relative z-10 flex-shrink-0">
                          <div className="w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center text-text-secondary">
                            {icon}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 pb-0.5">
                          <p className="text-sm text-text-primary leading-snug">{text}</p>
                          <p className="text-xs text-text-secondary mt-1">
                            {new Date(activity.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}