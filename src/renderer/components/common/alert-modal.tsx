import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AlertModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
}

export default function AlertModal({
  isOpen,
  title = '알림',
  message,
  confirmText = '확인',
  onConfirm,
}: AlertModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        onConfirm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onConfirm]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onConfirm}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border-1.2 border-black dark:border-transparent overflow-hidden"
          >
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-text-primary mb-2 tracking-tight">
                {title}
              </h3>
              <p className="text-text-secondary leading-relaxed font-medium">
                {message}
              </p>
            </div>

            <div className="px-6 py-4 bg-bg-secondary/30 flex justify-center border-t border-border/50">
              <button
                onClick={onConfirm}
                className="w-full px-4 py-2.5 text-sm font-bold rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:scale-95 transition-all"
                autoFocus
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}