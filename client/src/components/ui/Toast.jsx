import { toast as sonnerToast } from 'sonner';

// Re-export sonner toast with potential custom wrappers if needed later
export const toast = {
  success: (message, options) => sonnerToast.success(message, options),
  error: (message, options) => sonnerToast.error(message, options),
  info: (message, options) => sonnerToast.info(message, options),
  warning: (message, options) => sonnerToast.warning(message, options),
  default: (message, options) => sonnerToast(message, options),
};
