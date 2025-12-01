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
  onDelete
}: TodoItemProps) {
  return (
    <div className="p-3 hover:bg-gray-50 transition-colors group">
      <div className="flex items-start gap-3">
        {/* 체크박스 */}
        <input
          type="checkbox"
          checked={completed}
          onChange={() => onToggleComplete(id)}
          className="mt-1 w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          {/* TODO 텍스트 */}
          <p className={`text-sm break-words ${completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
            {text}
          </p>
          
          {/* 시간 정보 (있으면) */}
          {dueTime && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-gray-500">
                🕐 {getTimeDisplayText(dueTime)}
              </span>
            </div>
          )}
        </div>

        {/* 우측 버튼 그룹 */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* 핀 버튼 */}
          <button
            onClick={() => onTogglePin(id)}
            className={`p-1 rounded transition-all ${
              isPinned 
                ? 'text-yellow-500 hover:text-yellow-600' 
                : 'text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100'
            }`}
            title={isPinned ? '고정 해제' : '고정'}
          >
            {isPinned ? (
              <span className="text-base">📌</span>
            ) : (
              <span className="text-base">📍</span>
            )}
          </button>

          {/* 삭제 버튼 */}
          <button
            onClick={() => onDelete(id)}
            className="p-1 rounded transition-all text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100"
            title="삭제"
          >
            <span className="text-base">🗑️</span>
          </button>
        </div>
      </div>
    </div>
  );
}