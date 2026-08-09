import { useAuth } from '../../context/AuthContext';
import { useLogout } from '../../hooks/useAuthQueries';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UserProfileDropdown() {
  const { user } = useAuth();
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => navigate('/login')
    });
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 focus:outline-none">
        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
          <User size={16} />
        </div>
        <span className="text-sm font-medium text-text-primary hidden sm:block">{user?.name}</span>
      </button>

      {/* Dropdown Menu - shows on hover for simplicity in scaffolding */}
      <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        <div className="p-2 border-b border-border">
          <p className="text-sm font-medium text-text-primary truncate">{user?.name}</p>
          <p className="text-xs text-text-secondary truncate">{user?.email}</p>
        </div>
        <div className="p-1">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger/10 rounded-lg transition-colors text-left"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
