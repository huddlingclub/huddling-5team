import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '#components/ui/dialog.jsx';

// 공용 모달 래퍼
export default function Modal({ open, onClose, title, titleClassName, description, descriptionClassName, contentClassName, children }) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose?.()}>
      <DialogContent className={contentClassName}>
        <DialogHeader>
          {title && <DialogTitle className={titleClassName}>{title}</DialogTitle>}
          {description && <DialogDescription className={descriptionClassName}>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
