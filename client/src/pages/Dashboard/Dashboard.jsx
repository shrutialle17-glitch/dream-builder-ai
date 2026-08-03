//import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
export default function Dashboard() {
  //const { user } = useAuth();
  const user = {
    name: "Arya"
  };
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.name || 'Entrepreneur'}!`}
        description="Here is what's happening with your startups today."
        action={{ label: 'New Project', onClick: () => navigate('/projects?new=true') }}
      />
    </div>
  );
}
