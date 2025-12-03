import TodoItem from './common/todo-item';
import { CategorySectionProps } from './types';

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

  return (
    <div className="mb-4">
      {/* 헤더 */}
      <button
        onClick={() => onToggleExpand(categoryValue)}
        className="flex items-center gap-3 mb-2 hover:opacity-70 transition-opacity group w-full"
      >
        {/* 화살표 */}
        <span 
          className="text-accent text-base font-bold transition-transform duration-200" 
          style={{
            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'
          }}
        >
          ▸
        </span>
        
        {/* 카테고리 이름 */}
        <h2 className="text-lg font-bold text-text-primary">
          {categoryLabel}
        </h2>
        
        {/* TODO 개수 */}
        <span className="text-sm text-text-secondary font-semibold">
          {todoCount}
        </span>
      </button>

      {/* TODO 목록 */}
      {isExpanded && (
        <div className="ml-5 space-y-0">
          {todos.length === 0 ? (
            <div className="text-text-secondary text-base ml-6 py-2 font-medium">
              할 일이 없습니다
            </div>
          ) : (
            <div className="space-y-0">
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}