import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Rocket, Target, Building2, FileText, Lightbulb, Wrench, TrendingUp, RocketIcon } from 'lucide-react';

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  industry: z.string().optional(),
  startupStage: z.string().optional(),
});

const STAGE_OPTIONS = [
  { value: 'IDEA', label: 'Idea Phase', hint: 'Just a concept', icon: Lightbulb },
  { value: 'MVP', label: 'MVP', hint: 'Prototyping', icon: Wrench },
  { value: 'EARLY_TRACTION', label: 'Early Traction', hint: 'First customers', icon: TrendingUp },
  { value: 'GROWTH', label: 'Growth', hint: 'Scaling up', icon: RocketIcon },
];

export default function ProjectModal({ isOpen, onClose, onSubmit, initialData = null, isPending = false }) {
  const isEditing = !!initialData;

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      industry: '',
      startupStage: '',
    }
  });

  const descriptionValue = watch('description') || '';
  const selectedStage = watch('startupStage');

  useEffect(() => {
    if (isOpen) {
      reset(initialData || { name: '', description: '', industry: '', startupStage: '' });
    }
  }, [isOpen, initialData, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg text-primary shrink-0">
            <Rocket size={16} />
          </span>
          {isEditing ? 'Edit Project' : 'New Project'}
        </span>
      }
      description={isEditing ? 'Update your startup details below.' : 'Give your new startup a name and basic details to get started.'}
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="secondary" onClick={onClose} disabled={isPending} className="px-6">Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isPending} className="px-6 gap-2">
            {isPending ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Project')}
            {!isPending && !isEditing && <Rocket size={16} />}
          </Button>
        </div>
      }
    >
      <form className="space-y-5 py-2">
        {/* Core details */}
        <div className="bg-background/60 border border-border/60 rounded-2xl p-5 space-y-5">
          <div>
            <Input
              label="Project Name"
              placeholder="e.g., NovaCare AI"
              {...register('name')}
              error={errors.name?.message}
              icon={<Target size={18} className="text-text-secondary" />}
            />
            <p className="text-xs text-text-secondary mt-1.5 ml-0.5">This is how your project will appear across the platform.</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-sm font-medium text-text-primary">
                <FileText size={14} className="text-text-secondary" />
                Description
                <span className="text-xs font-normal text-text-secondary">(optional)</span>
              </label>
              {descriptionValue.length > 0 && (
                <span className="text-xs text-text-secondary tabular-nums">{descriptionValue.length}</span>
              )}
            </div>
            <textarea
              className={`w-full px-4 py-3 bg-surface border ${errors.description ? 'border-danger focus:ring-danger' : 'border-border hover:border-text-secondary/40 focus:border-primary focus:ring-primary'} rounded-xl text-text-primary focus:outline-none focus:ring-2 transition-all resize-none min-h-[90px] placeholder:text-text-secondary`}
              placeholder="Brief description of your startup idea and the problem it solves..."
              {...register('description')}
            />
            {errors.description && <p className="text-xs text-danger mt-1">{errors.description.message}</p>}
          </div>

          <Input
            label="Industry (optional)"
            placeholder="e.g., HealthTech, SaaS"
            {...register('industry')}
            error={errors.industry?.message}
            icon={<Building2 size={18} className="text-text-secondary" />}
          />
        </div>

        {/* Stage selector */}
        <div className="space-y-2.5">
          <label className="block text-sm font-medium text-text-primary">
            Startup Stage <span className="text-xs font-normal text-text-secondary">(optional)</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {STAGE_OPTIONS.map(({ value, label, hint, icon: Icon }) => {
              const isSelected = selectedStage === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setValue('startupStage', value, { shouldValidate: true, shouldDirty: true })}
                  className={`relative flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/[0.06] ring-1 ring-primary/30'
                      : 'border-border hover:border-text-secondary/40 hover:bg-background/40'
                  }`}
                >
                  <span className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-colors ${
                    isSelected ? 'bg-primary/15 text-primary' : 'bg-background text-text-secondary'
                  }`}>
                    <Icon size={15} />
                  </span>
                  <span className="min-w-0">
                    <span className={`block text-sm font-medium truncate ${isSelected ? 'text-primary' : 'text-text-primary'}`}>
                      {label}
                    </span>
                    <span className="block text-xs text-text-secondary truncate">{hint}</span>
                  </span>
                </button>
              );
            })}
          </div>
          {errors.startupStage && <p className="text-xs text-danger">{errors.startupStage.message}</p>}
        </div>
      </form>
    </Modal>
  );
}