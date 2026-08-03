import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Settings as SettingsIcon, Menu } from 'lucide-react';
import ThemeToggle from '../components/common/ThemeToggle';
//import UserProfileDropdown from '../components/common/UserProfileDropdown';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-sidebar border-r border-border transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-start gap-3 h-16 border-b border-border px-6 py-2">
          <img src="/assests/images/logo.png" alt="Dream Builder AI" className="h-8 w-auto object-contain" />
          <span className="font-display font-bold text-lg text-text-primary tracking-tight truncate">Dream Builder AI</span>
        </div>
        <nav className="p-4 space-y-2">
          <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-3 px-4 py-2 rounded-xl transition-colors ${isActive ? 'bg-primary text-white' : 'text-text-secondary hover:bg-surface hover:text-text-primary'}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/projects" className={({ isActive }) => `flex items-center gap-3 px-4 py-2 rounded-xl transition-colors ${isActive ? 'bg-primary text-white' : 'text-text-secondary hover:bg-surface hover:text-text-primary'}`}>
            <FolderKanban size={20} />
            <span>Projects</span>
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => `flex items-center gap-3 px-4 py-2 rounded-xl transition-colors ${isActive ? 'bg-primary text-white' : 'text-text-secondary hover:bg-surface hover:text-text-primary'}`}>
            <SettingsIcon size={20} />
            <span>Settings</span>
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar */}
        <header className="flex items-center justify-between h-16 px-6 bg-surface border-b border-border">
          <div className="flex items-center gap-4 flex-1">
            <button className="lg:hidden text-text-primary focus:outline-none" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            
            {/* Search Bar */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-xl w-96 text-text-secondary focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input 
                type="text" 
                placeholder="Search projects..." 
                className="bg-transparent border-none outline-none w-full text-sm text-text-primary placeholder:text-text-secondary"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button className="text-text-secondary hover:text-text-primary transition-colors relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
            </button>
            <div className="w-px h-6 bg-border mx-2 hidden sm:block"></div>
            {/* <UserProfileDropdown /> */}
          </div>
        </header>

        {/* Routed Content */}
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={toggleSidebar}></div>
      )}
    </div>
  );
}
