import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', isDestructive = false, isPending = false }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isPending}>{cancelText}</Button>
          <Button variant={isDestructive ? 'danger' : 'primary'} onClick={onConfirm} disabled={isPending}>
            {isPending ? 'Confirming...' : confirmText}
          </Button>
        </>
      }
    >
      <p className="text-text-secondary">{message}</p>
    </Modal>
  );
}
