import { useState, useEffect } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { useUpdateProfile, useUpdatePassword, useLogout } from '../../hooks/useAuthQueries';
import { User, Mail, Lock, LogOut, Moon, Sun, Save } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function Settings() {
  const { user } = useAuth();
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateProfile();
  const { mutate: updatePassword, isPending: isUpdatingPassword } = useUpdatePassword();
  const { mutate: logout } = useLogout();

  const [profileData, setProfileData] = useState({ name: user?.name || '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const html = document.documentElement;
    setIsDark(html.getAttribute('data-theme') !== 'light');
  }, []);

  const handleThemeChange = (dark) => {
    setIsDark(dark);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfile({ name: profileData.name });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) return;
    updatePassword(passwordData, {
      onSuccess: () => setPasswordData({ currentPassword: '', newPassword: '' })
    });
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <div className="space-y-10 max-w-4xl pb-10">
      <PageHeader title="Settings" description="Manage your account, preferences, and security." />
      
      {/* Profile Settings */}
      <section>
        <h3 className="text-lg font-display font-semibold text-text-primary mb-4">Profile Settings</h3>
        <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex items-start gap-8 flex-col md:flex-row">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary text-4xl font-bold font-display border-2 border-primary/30">
                {getInitial(user?.name)}
              </div>
            </div>
            
            <form onSubmit={handleProfileSubmit} className="flex-grow space-y-4 w-full">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-text-secondary" />
                  </div>
                  <Input 
                    className="pl-10" 
                    placeholder="Enter your name" 
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-text-secondary" />
                  </div>
                  <Input 
                    className="pl-10 bg-background opacity-70" 
                    value={user?.email || ''}
                    readOnly
                    disabled
                  />
                </div>
                <p className="text-xs text-text-secondary mt-1">Email changes require support verification.</p>
              </div>

              <div className="pt-2">
                <Button type="submit" isLoading={isUpdatingProfile} icon={<Save size={18} />}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Preferences */}
      <section>
        <h3 className="text-lg font-display font-semibold text-text-primary mb-4">Preferences</h3>
        <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-semibold text-text-primary">Theme Appearance</h4>
              <p className="text-sm text-text-secondary mt-1">Switch between light and dark mode.</p>
            </div>
            <div className="flex items-center bg-background border border-border rounded-xl p-1">
              <button 
                type="button"
                onClick={() => handleThemeChange(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!isDark ? 'bg-surface text-primary shadow-sm border border-border' : 'text-text-secondary hover:text-text-primary'}`}
              >
                <Sun size={16} />
                Light
              </button>
              <button 
                type="button"
                onClick={() => handleThemeChange(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? 'bg-surface text-primary shadow-sm border border-border' : 'text-text-secondary hover:text-text-primary'}`}
              >
                <Moon size={16} />
                Dark
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Account Security */}
      <section>
        <h3 className="text-lg font-display font-semibold text-text-primary mb-4">Account Security</h3>
        <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-sm">
          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md mb-8">
            <h4 className="text-base font-semibold text-text-primary mb-4">Change Password</h4>
            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Current Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-text-secondary" />
                </div>
                <Input 
                  type="password" 
                  className="pl-10" 
                  placeholder="Enter current password" 
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-text-secondary" />
                </div>
                <Input 
                  type="password" 
                  className="pl-10" 
                  placeholder="Enter new password" 
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="outline" isLoading={isUpdatingPassword}>
                Update Password
              </Button>
            </div>
          </form>

          <div className="pt-8 border-t border-border">
            <h4 className="text-base font-semibold text-text-primary mb-2">Sign Out</h4>
            <p className="text-sm text-text-secondary mb-4">You will be securely logged out of Dream Builder AI.</p>
            <Button variant="danger" onClick={() => logout()} icon={<LogOut size={18} />}>
              Sign Out
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
