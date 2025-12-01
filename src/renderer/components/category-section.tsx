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
  onDelete
}: CategorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(true); // 기본값을 true로 변경

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const todoCount = todos.length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* 카테고리 헤더 (접기/펼치기) */}
      <button
        onClick={toggleExpand}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {/* 화살표 아이콘 */}
          <span 
            className="text-gray-500 text-xs transition-transform duration-200" 
            style={{
              transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'
            }}
          >
            ▶
          </span>
          
          {/* 카테고리 아이콘 */}
          <span className="text-lg">{categoryIcon}</span>
          
          {/* 카테고리 이름 */}
          <span className="font-semibold text-gray-800 text-sm">{categoryLabel}</span>
          
          {/* TODO 개수 */}
          <span className="text-xs text-gray-500">({todoCount})</span>
        </div>
      </button>

      {/* TODO 목록 (펼쳐진 경우만 표시) */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          {todos.length === 0 ? (
            <div className="p-3 text-center text-gray-400 text-xs">
              할 일이 없습니다
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
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
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}