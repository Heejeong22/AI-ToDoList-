import TextInput from './common/text-input';
import { motion, AnimatePresence } from 'framer-motion';
import CategorySection from './category-section';
import ExpandCollapseButton from './common/expand-collapse-button';
import HelpButton from './common/help-button';
import AlertModal from './common/alert-modal';
import TutorialModal from './common/tutorial-modal';
import LoadingModal from './common/loading-modal';
import { CATEGORIES, SCHEDULE_CATEGORY } from './constants';
import { getToday, getDateDisplayText, isSameDay } from './utils/date-utils';
import { useTodoState } from './hooks/use-todo-state';
import { useTodoActions } from './hooks/use-todo-actions';
import { useTodoFilters } from './hooks/use-todo-filters';
import { useModals } from './hooks/use-modals';
import { safeParseJSON } from '../../main/parser';
import { Sun, Moon } from 'lucide-react';

const buildDueDateFromInput = (date: Date, time?: string) => {
  const composed = new Date(date);
  if (time) {
    const [hours, minutes] = time.split(':').map(Number);
    composed.setHours(hours, minutes, 0, 0);
  } else {
    composed.setHours(0, 0, 0, 0);
  }
  return composed;
};

interface TodoListProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function TodoList({ isDarkMode, toggleTheme }: TodoListProps) {
  // Custom Hooks
  const {
    todos,
    setTodos,
    selectedDate,
    setSelectedDate,
    expandedCategories,
    setExpandedCategories,
    isLoading,
    setIsLoading,
    mapDbTodoToUiTodo,
  } = useTodoState();

  // Modals
  const {
    alertModal,
    showAlert,
    closeAlert,
    showTutorial,
    openTutorial,
    closeTutorial,
  } = useModals();

  // CRUD Actions
  const { addTodo, toggleComplete, togglePin, deleteTodo, editTodo } = useTodoActions({
    todos,
    setTodos,
    setIsLoading,
    mapDbTodoToUiTodo,
    showAlert,
  });

  // Filters & Stats
  const { getTodosByCategory, getScheduledTodos, getStats } = useTodoFilters({
    todos,
    selectedDate,
  });

  // Category Expansion
  const toggleCategoryExpand = (categoryValue: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryValue)) {
        newSet.delete(categoryValue);
      } else {
        newSet.add(categoryValue);
      }
      return newSet;
    });
  };

  const toggleAllCategories = () => {
    if (expandedCategories.size > 0) {
      setExpandedCategories(new Set());
    } else {
      const allValues = [SCHEDULE_CATEGORY.value, ...CATEGORIES.map(cat => cat.value)];
      setExpandedCategories(new Set(allValues));
    }
  };

  // Date Navigation
  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(getToday());
  };

  const { totalTodos, completedTodos } = getStats();
  const scheduledTodos = getScheduledTodos();

  return (
    <div className="flex flex-col h-full bg-bg-primary dark:bg-bg-primary">
      {/* Header */}
      <header className="px-6 py-6 border-b border-border/40 shrink-0 bg-bg-tertiary/80 dark:bg-zinc-800/90 backdrop-blur-md sticky top-0 z-10 transition-all">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary flex items-baseline gap-2">
            ToDo
            <span className="text-sm font-medium text-text-tertiary">
              {totalTodos > 0 ? `${completedTodos}/${totalTodos}` : '0'}
            </span>
          </h1>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-transparent text-text-secondary hover:bg-white dark:hover:bg-white/10 hover:text-text-primary transition-all active:scale-95"
              title="테마 변경"
            >
              {isDarkMode ? <Sun size={20} strokeWidth={2.5} /> : <Moon size={20} strokeWidth={2.5} />}
            </button>
            <HelpButton onClick={openTutorial} />
            <ExpandCollapseButton
              expandedCategories={expandedCategories}
              totalCategories={CATEGORIES.length}
              onToggleAll={toggleAllCategories}
            />
          </div>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-center gap-6 p-1 rounded-xl">
          <button
            onClick={() => changeDate(-1)}
            className="p-2 rounded-xl hover:bg-white dark:hover:bg-white/10 text-text-secondary transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex flex-col items-center">
            <span className="text-base font-semibold text-text-primary">
              {getDateDisplayText(selectedDate)}
            </span>
          </div>

          <button
            onClick={() => changeDate(1)}
            className="p-2 rounded-xl hover:bg-white dark:hover:bg-white/10 text-text-secondary transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Back to Today Button */}
        {!isSameDay(selectedDate, getToday()) && (
          <button
            onClick={goToToday}
            className="mx-auto mt-2 px-4 py-1 text-sm font-bold text-text-tertiary hover:text-text-primary transition-all flex items-center gap-2 group"
          >
            <svg className="w-4 h-4 group-hover:-rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            <span>오늘로 돌아가기</span>
          </button>
        )}
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-6 scrollbar-thin scrollbar-thumb-border/50 scrollbar-track-transparent">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDate.toISOString()}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="min-h-full"
          >
            {totalTodos === 0 && todos.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-text-tertiary space-y-4 pt-20">
                <div className="w-16 h-16 rounded-2xl bg-bg-secondary flex items-center justify-center shadow-inner">
                  <span className="text-4xl filter grayscale opacity-50">✨</span>
                </div>
                <p className="text-sm font-medium">할 일이 없습니다. 아래에서 추가해보세요!</p>
              </div>
            ) : (
              <div className="space-y-6 pb-6">
                {/* Scheduled Block */}
                <CategorySection
                  categoryValue={SCHEDULE_CATEGORY.value}
                  categoryLabel={SCHEDULE_CATEGORY.label}
                  categoryIcon={SCHEDULE_CATEGORY.icon}
                  todos={scheduledTodos}
                  onToggleComplete={toggleComplete}
                  onTogglePin={togglePin}
                  onDelete={deleteTodo}
                  onEdit={editTodo}
                  selectedDate={selectedDate}
                  isExpanded={expandedCategories.has(SCHEDULE_CATEGORY.value)}
                  onToggleExpand={toggleCategoryExpand}
                />

                {/* Categories */}
                <div className="space-y-6">
                  {CATEGORIES.map(category => {
                    const categoryTodos = getTodosByCategory(category.value);
                    if (categoryTodos.length === 0) return null;

                    return (
                      <CategorySection
                        key={category.value}
                        categoryValue={category.value}
                        categoryLabel={category.label}
                        categoryIcon={category.icon}
                        todos={categoryTodos}
                        onToggleComplete={toggleComplete}
                        onTogglePin={togglePin}
                        onDelete={deleteTodo}
                        onEdit={editTodo}
                        selectedDate={selectedDate}
                        isExpanded={expandedCategories.has(category.value)}
                        onToggleExpand={toggleCategoryExpand}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-bg-tertiary/80 dark:bg-zinc-800/90 backdrop-blur-md border-t border-border/40 shrink-0 z-20">
        <div className="max-w-full mx-auto">
          <TextInput
            placeholder="무엇을 해야 하나요?"
            maxLength={100}
            rows={1}
            onSubmit={async (text, dueDateInput, dueTime) => {
              try {
                setIsLoading(true);

                const response = await window.api.ai.gptAnalyzeTodo(text);

                if (!response.success || !response.data) {
                  showAlert("AI 오류", "텍스트를 분석할 수 없습니다.");
                  return;
                }

                const parsed = safeParseJSON(response.data);

                if (!parsed) {
                  showAlert("파싱 오류", "AI 응답을 처리할 수 없습니다.");
                  return;
                }

                const manualDueDate = buildDueDateFromInput(dueDateInput, dueTime);

                await addTodo(parsed, manualDueDate, dueTime);

              } catch (err) {
                console.error(err);
                showAlert("오류", "예기치 않은 오류가 발생했습니다.");
              } finally {
                setIsLoading(false);
              }
            }}
            defaultDate={selectedDate}
          />
        </div>
      </div>

      {/* Modals */}
      <AlertModal
        isOpen={alertModal.isOpen}
        title={alertModal.title}
        message={alertModal.message}
        onConfirm={closeAlert}
      />
      <TutorialModal isOpen={showTutorial} onClose={closeTutorial} />
      <LoadingModal isOpen={isLoading} />
    </div>
  );
}
