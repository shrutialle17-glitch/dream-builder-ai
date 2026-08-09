import PageHeader from '../../components/ui/PageHeader';

export default function Settings() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your account preferences." />
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm max-w-2xl">
        <h3 className="text-lg font-display font-semibold text-text-primary mb-4">Profile Settings</h3>
        <p className="text-text-secondary">Profile configuration options will go here.</p>
      </div>
    </div>
  );
}
