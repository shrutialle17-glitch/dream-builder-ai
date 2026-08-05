import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Rocket, Target, Building2, Briefcase } from 'lucide-react';

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  industry: z.string().optional(),
  startupStage: z.string().optional(),
});

export default function ProjectModal({ isOpen, onClose, onSubmit, initialData = null, isPending = false }) {
  const isEditing = !!initialData;
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      industry: '',
      startupStage: '',
    }
  });

  useEffect(() => {
    if (isOpen) {
      reset(initialData || { name: '', description: '', industry: '', startupStage: '' });
    }
  }, [isOpen, initialData, reset]);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isEditing ? 'Edit Project' : 'New Project'}
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
      <form className="space-y-6 py-2">
        <div className="space-y-4">
          <Input 
            label="Project Name" 
            placeholder="e.g., NovaCare AI"
            {...register('name')}
            error={errors.name?.message}
            icon={<Target size={18} className="text-text-secondary" />}
          />
          
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-primary">Description</label>
            <textarea 
              className={`w-full px-4 py-3 bg-background border ${errors.description ? 'border-danger focus:ring-danger' : 'border-border focus:ring-primary'} rounded-xl text-text-primary focus:outline-none focus:ring-2 transition-all resize-none min-h-[100px] placeholder:text-text-secondary`}
              placeholder="Brief description of your startup idea and the problem it solves..."
              {...register('description')}
            />
            {errors.description && <p className="text-xs text-danger mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input 
              label="Industry" 
              placeholder="e.g., HealthTech, SaaS"
              {...register('industry')}
              error={errors.industry?.message}
              icon={<Building2 size={18} className="text-text-secondary" />}
            />
            
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-primary">Startup Stage</label>
              <div className="relative">
                <Briefcase size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
                <select 
                  className={`w-full pl-10 pr-4 py-2.5 bg-background border ${errors.startupStage ? 'border-danger focus:ring-danger' : 'border-border focus:ring-primary'} rounded-xl text-text-primary appearance-none focus:outline-none focus:ring-2 transition-all`}
                  {...register('startupStage')}
                >
                  <option value="" disabled className="text-text-secondary">Select Stage</option>
                  <option value="IDEA">Idea Phase</option>
                  <option value="MVP">MVP / Prototyping</option>
                  <option value="EARLY_TRACTION">Early Traction</option>
                  <option value="GROWTH">Growth & Scaling</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-text-secondary">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                </div>
              </div>
              {errors.startupStage && <p className="text-xs text-danger mt-1">{errors.startupStage.message}</p>}
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
