import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Trash2, Edit2, Pin, X, Save, Clock } from 'lucide-react';
import AlertModal from './alert-modal';
import { TodoItemProps } from '../types';
import { getTimeDisplayText } from '../utils/date-utils';

export default function TodoItem({
  id,
  text,
  completed,
  isPinned,
  dueTime,
  onToggleComplete,
  onTogglePin,
  onDelete,
  onEdit
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const [showAlert, setShowAlert] = useState(false);

  const handleSaveEdit = () => {
    if (editText.trim() === '') {
      setShowAlert(true);
      return;
    }
    if (onEdit) {
      onEdit(id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(text);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 15 },
          visible: { opacity: 1, y: 0 }
        }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ scale: 1.01, boxShadow: "0 8px 16px -4px rgba(0,0,0,0.1)" }}
        whileTap={{ scale: 0.98 }}
        className={`group relative flex items-center gap-3 py-3 px-3.5 mb-2.5 rounded-2xl transition-colors duration-200 border-1.2 ${completed
          ? 'bg-bg-secondary/50 border-transparent opacity-80'
          : 'bg-white dark:bg-zinc-800 border-black dark:border-transparent shadow-sm hover:border-black'
          }`}
      >
        {/* Checkbox */}
        <button
          onClick={() => onToggleComplete(id)}
          disabled={isEditing}
          className={`flex-shrink-0 w-[18px] h-[18px] rounded-[6px] flex items-center justify-center transition-all duration-200 ${completed
            ? 'bg-black border-1.2 border-black text-white dark:bg-white dark:border-white dark:text-black shadow-sm'
            : 'bg-white dark:bg-transparent border-1.2 border-black dark:border-white/30 hover:bg-black/5'
            }`}
        >
          {completed && <Check size={12} strokeWidth={3} />}
        </button>

        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-start justify-between">
            {isEditing ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-none p-0 -ml-[1px] focus:outline-none focus:ring-0 text-text-primary font-medium text-base leading-snug"
                autoFocus
                maxLength={100}
                spellCheck={false}
                autoComplete="off"
              />
            ) : (
              <span
                className={`text-base leading-snug cursor-text transition-colors font-medium ${completed ? 'line-through text-text-tertiary' : 'text-text-primary'
                  }`}
                onDoubleClick={() => !completed && setIsEditing(true)}
              >
                {text}
              </span>
            )}
          </div>

          {(dueTime || isPinned) && (
            <div className="flex items-center gap-2 mt-0.5 min-h-[1.25rem]">
              {dueTime && (
                <span className={`text-xs flex items-center gap-1 font-medium ${completed ? 'text-text-tertiary' : 'text-primary'}`}>
                  <Clock size={12} strokeWidth={2} />
                  {getTimeDisplayText(dueTime)}
                </span>
              )}
              {isPinned && <Pin size={12} className="text-orange-500 transform rotate-45" fill="currentColor" />}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className={`flex items-center gap-1 transition-opacity absolute right-3 top-1/2 -translate-y-1/2 bg-white dark:bg-zinc-700/90 backdrop-blur-sm shadow-md border border-gray-200 dark:border-white/10 rounded-xl p-1 z-20 ${isEditing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}>
          {isEditing ? (
            <>
              <button
                onClick={handleSaveEdit}
                className="p-1.5 text-primary hover:bg-primary/10 dark:hover:bg-primary/20 rounded-lg transition-colors"
                title="Save"
              >
                <Check size={14} strokeWidth={2.5} />
              </button>
              <button
                onClick={handleCancelEdit}
                className="p-1.5 text-text-secondary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg transition-colors"
                title="Cancel"
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-text-secondary hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit2 size={14} strokeWidth={2} />
              </button>
              <button
                onClick={() => onTogglePin(id)}
                className={`p-1.5 rounded-lg transition-colors ${isPinned ? 'text-orange-500 bg-orange-50 dark:bg-orange-500/20' : 'text-text-secondary hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/20'
                  }`}
                title={isPinned ? 'Unpin' : 'Pin'}
              >
                <Pin size={14} strokeWidth={2} />
              </button>
              <button
                onClick={() => onDelete(id)}
                className="p-1.5 text-text-secondary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 size={14} strokeWidth={2} />
              </button>
            </>
          )}
        </div>
      </motion.div >

      <AlertModal
        isOpen={showAlert}
        title="Input Required"
        message="Please enter some text."
        onConfirm={() => setShowAlert(false)}
      />
    </>
  );
}