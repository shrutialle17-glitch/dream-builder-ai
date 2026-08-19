import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BrainCircuit,
  FileText,
  LineChart,
  Settings,
} from 'lucide-react';

import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const modules = [
  {
    title: 'Pitch Deck Generator',
    description: 'Generate and manage an investor-ready pitch deck for your startup.',
    icon: FileText,
    path: 'pitch-deck',
  },
  {
    title: 'Digital Twin',
    description: 'Simulate your startup and explore AI-powered insights and scenarios.',
    icon: BrainCircuit,
    path: 'digital-twin',
  },
  {
    title: 'AI Market Research',
    description: 'Research your market, competitors, customers, and industry opportunities.',
    icon: LineChart,
    path: 'market-research',
  },
];

export default function ProjectWorkspace() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="mb-3 flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </button>

          <h1 className="text-3xl font-display font-bold text-text-primary">
            Project Workspace
          </h1>

          <p className="mt-2 text-text-secondary">
            Build, analyze, and grow your startup from one workspace.
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={() => navigate('/projects')}
          className="gap-2"
        >
          <Settings size={18} />
          Project Settings
        </Button>
      </div>

      <Card>
        <CardBody>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-text-secondary">
              Project
            </p>

            <h2 className="mt-2 text-xl font-semibold text-text-primary">
              Startup Workspace
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Project ID: {projectId}
            </p>
          </div>
        </CardBody>
      </Card>

      <div>
        <div className="mb-5">
          <h2 className="text-xl font-display font-semibold text-text-primary">
            Startup Tools
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Choose a module to continue building your startup.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => {
            const Icon = module.icon;

            return (
              <Card
                key={module.title}
                className="group cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
                onClick={() =>
                  navigate(`/projects/${projectId}/${module.path}`)
                }
              >
                <CardBody className="flex h-full flex-col">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon size={24} />
                  </div>

                  <h3 className="text-lg font-semibold text-text-primary">
                    {module.title}
                  </h3>

                  <p className="mt-2 flex-1 text-sm leading-6 text-text-secondary">
                    {module.description}
                  </p>

                  <div className="mt-6 text-sm font-medium text-primary">
                    Open Module →
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}