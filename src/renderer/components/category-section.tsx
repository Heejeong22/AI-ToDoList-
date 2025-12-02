import { useState } from 'react';
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
  onAddTodo,
  selectedDate,
  isExpanded,
  onToggleExpand
}: CategorySectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTodoText, setNewTodoText] = useState('');

  const handleAddTodo = () => {
    if (newTodoText.trim() === '') {
      alert('내용을 입력해주세요!');
      return;
    }
    if (onAddTodo) {
      onAddTodo(newTodoText.trim());
    }
    setNewTodoText('');
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    } else if (e.key === 'Escape') {
      setNewTodoText('');
      setIsAdding(false);
    }
  };

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
          
          {/* + 버튼 또는 입력창 */}
          <div className="ml-6 mt-2">
            {isAdding ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="새 할 일..."
                  className="flex-1 px-3 py-2 text-base border-2 border-input-border rounded focus:outline-none focus:ring-2 focus:ring-accent bg-bg-card text-text-primary font-medium"
                  autoFocus
                  maxLength={100}
                />
                <button
                  onClick={handleAddTodo}
                  className="px-4 py-2 text-sm bg-accent text-bg-card rounded hover:bg-text-secondary transition-colors font-semibold"
                >
                  추가
                </button>
                <button
                  onClick={() => {
                    setNewTodoText('');
                    setIsAdding(false);
                  }}
                  className="px-4 py-2 text-sm bg-bg-hover text-text-primary rounded hover:bg-bg-secondary transition-colors font-semibold border border-border"
                >
                  취소
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 text-accent hover:text-text-primary transition-colors font-medium"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm">할 일 추가</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}