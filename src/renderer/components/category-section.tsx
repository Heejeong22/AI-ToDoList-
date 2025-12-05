import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Briefcase, User, BookOpen, Heart, CheckCircle2, MoreHorizontal, Calendar } from 'lucide-react';
import TodoItem from './common/todo-item';
import { CategorySectionProps } from './types';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// Map categories to pastel themes defined in tailwind.config.js
const categoryThemes: Record<string, string> = {
  schedule: 'bg-pastel-blue text-ptext-blue dark:bg-opacity-20',
  study: 'bg-pastel-purple text-ptext-purple dark:bg-opacity-20',
  'self-dev': 'bg-pastel-green text-ptext-green dark:bg-opacity-20',
  health: 'bg-pastel-pink text-ptext-pink dark:bg-opacity-20',
  etc: 'bg-pastel-yellow text-ptext-yellow dark:bg-opacity-20',
  default: 'bg-bg-tertiary text-text-secondary',
};

export default function CategorySection({
  categoryValue,
  categoryLabel,
  categoryIcon,
  todos,
  onToggleComplete,
  onTogglePin,
  onDelete,
  onEdit,
  selectedDate,
  isExpanded,
  onToggleExpand
}: CategorySectionProps) {
  const todoCount = todos.length;

  // Determine Theme
  // User requested to remove category colors (2025-12-06)
  const themeClass = 'bg-bg-tertiary text-text-secondary dark:bg-zinc-800 dark:text-zinc-400';

  // Icon Mapping
  const getIcon = (val: string) => {
    switch (val) {
      case 'work': return <Briefcase size={20} strokeWidth={2.5} />;
      case 'personal': return <User size={20} strokeWidth={2.5} />;
      case 'study': return <BookOpen size={20} strokeWidth={2.5} />;
      case 'health': return <Heart size={20} strokeWidth={2.5} />;
      case 'productivity': return <CheckCircle2 size={20} strokeWidth={2.5} />;
      case 'schedule': return <Calendar size={20} strokeWidth={2.5} />;
      default: return <MoreHorizontal size={20} strokeWidth={2.5} />;
    }
  };

  return (
    <div className="mb-4">
      {/* Header with Pastel Theme */}
      <button
        onClick={() => onToggleExpand(categoryValue)}
        className={cn(
          "flex items-center gap-3 w-full px-4 py-3 rounded-2xl transition-all duration-200 group border-1.2 relative",
          // Light: border-black (retro 1.2px). Dark: transparent.
          "border-black dark:border-transparent",
          themeClass,
          "shadow-sm hover:shadow-md hover:-translate-y-0.5"
        )}
      >
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="opacity-70 group-hover:opacity-100"
        >
          <ChevronRight size={20} strokeWidth={2.5} />
        </motion.div>

        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-bg-secondary text-text-secondary">
            {getIcon(categoryValue)}
          </span>
          <h2 className="text-base font-semibold tracking-tight opacity-90 capitalize">
            {categoryLabel}
          </h2>
        </div>

        <span className={cn(
          "ml-auto text-xs font-semibold px-2.5 py-1 rounded-full",
          "bg-bg-secondary text-text-secondary"
        )}>
          {todoCount}
        </span>
      </button>

      {/* Todo List */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-2 pt-2 pb-1 space-y-2">
              {todos.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-text-secondary text-center py-6 italic bg-bg-secondary/30 rounded-xl border-1.2 border-dashed border-black/20 dark:border-white/20 mx-2"
                >
                  <p>할 일이 없습니다</p>
                </motion.div>
              ) : (
                <motion.div
                  className="space-y-2.5"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.08
                      }
                    }
                  }}
                >
                  <AnimatePresence>
                    {todos.map(todo => (
                      <TodoItem
                        key={todo.id}
                        id={todo.id}
                        text={todo.text}
                        completed={todo.completed}
                        isPinned={todo.isPinned}
                        dueDate={todo.dueDate}
                        dueTime={todo.dueTime}
                        onToggleComplete={onToggleComplete}
                        onTogglePin={onTogglePin}
                        onDelete={onDelete}
                        onEdit={onEdit}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}