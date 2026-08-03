import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Skeleton from '../ui/Skeleton';

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Skeleton className="w-12 h-12 rounded-full" />
      </div>
    );
  }

 if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }


  return <Outlet />;
}
