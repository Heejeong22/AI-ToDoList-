import { useState } from 'react';
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
      <div className="group py-2 hover:bg-bg-hover transition-colors rounded -ml-5 pl-5 pr-2">
        <div className="flex items-start gap-2.5">
          {/* 체크박스 */}
          <button
            onClick={() => onToggleComplete(id)}
            className={`mt-0.5 w-5 h-5 flex items-center justify-center rounded flex-shrink-0 transition-colors ${
              completed
                ? 'bg-accent border-2 border-accent'
                : 'border-2 border-input-border hover:border-accent'
            }`}
            disabled={isEditing}
          >
            {completed && (
              <svg className="w-3.5 h-3.5 text-bg-card" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            {/* 수정 모드 */}
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-3 py-2 text-base border-2 border-input-border rounded focus:outline-none focus:ring-2 focus:ring-accent bg-bg-card text-text-primary font-medium"
                  autoFocus
                  maxLength={100}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-1.5 text-sm bg-accent text-bg-card rounded hover:bg-text-secondary transition-colors font-semibold"
                  >
                    저장
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-1.5 text-sm bg-bg-hover text-text-primary rounded hover:bg-bg-secondary transition-colors font-semibold border border-border"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-baseline gap-2 flex-wrap">
                {/* TODO 텍스트 */}
                <span 
                  className={`text-base cursor-pointer font-medium ${
                    completed ? 'line-through text-text-secondary' : 'text-text-primary'
                  }`}
                  onDoubleClick={() => !completed && setIsEditing(true)}
                  title="더블클릭하여 수정"
                >
                  {text}
                </span>
                
                {/* 시간 정보 */}
                {dueTime && (
                  <span className="text-sm text-text-secondary font-medium">
                    {getTimeDisplayText(dueTime)}
                  </span>
                )}
                
                {/* 고정 표시 */}
                {isPinned && (
                  <svg className="w-3.5 h-3.5 text-accent" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                )}
              </div>
            )}
          </div>

          {/* 우측 버튼 그룹 */}
          {!isEditing && (
            <div className="flex items-center gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* 수정 */}
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 rounded hover:bg-bg-secondary transition-colors text-accent hover:text-text-primary"
                title="수정"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>

              {/* 고정 */}
              <button
                onClick={() => onTogglePin(id)}
                className={`p-1.5 rounded transition-colors ${
                  isPinned 
                    ? 'text-accent hover:bg-bg-secondary' 
                    : 'text-accent hover:text-text-primary hover:bg-bg-secondary'
                }`}
                title={isPinned ? '고정 해제' : '고정'}
              >
                <svg className="w-4 h-4" fill={isPinned ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>

              {/* 삭제 */}
              <button
                onClick={() => onDelete(id)}
                className="p-1.5 rounded hover:bg-red-100 transition-colors text-accent hover:text-red-600"
                title="삭제"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 알림 모달 */}
      <AlertModal
        isOpen={showAlert}
        title="입력 필요"
        message="내용을 입력해주세요!"
        onConfirm={() => setShowAlert(false)}
      />
    </>
  );
}