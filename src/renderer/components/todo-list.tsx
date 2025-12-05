import TextInput from './common/text-input';
import CategorySection from './category-section';
import ExpandCollapseButton from './common/expand-collapse-button';
import HelpButton from './common/help-button';
import AlertModal from './common/alert-modal';
import TutorialModal from './common/tutorial-modal';
import LoadingModal from './common/loading-modal';
import { CATEGORIES } from './constants';
import { getToday, getDateDisplayText, isSameDay } from './utils/date-utils';
import { useTodoState } from './hooks/use-todo-state';
import { useTodoActions } from './hooks/use-todo-actions';
import { useTodoFilters } from './hooks/use-todo-filters';
import { useModals } from './hooks/use-modals';
import { safeParseJSON } from '../../main/parser'; 

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

export default function TodoList() {
  // 커스텀 훅으로 상태 관리 분리
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

  // 모달 관리
  const {
    alertModal,
    showAlert,
    closeAlert,
    showTutorial,
    openTutorial,
    closeTutorial,
  } = useModals();

  // CRUD 액션
  const { addTodo, toggleComplete, togglePin, deleteTodo, editTodo } = useTodoActions({
    todos,
    setTodos,
    setIsLoading,
    mapDbTodoToUiTodo,
    showAlert,
  });

  // 필터링 & 통계
  const { getTodosByCategory, getStats } = useTodoFilters({
    todos,
    selectedDate,
  });

  // 카테고리 확장/축소
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
      setExpandedCategories(new Set(CATEGORIES.map(cat => cat.value)));
    }
  };

  // 날짜 네비게이션
  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(getToday());
  };

  const { totalTodos, completedTodos } = getStats();

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#FEFDFB' }}>
      {/* 헤더 */}
      <div className="px-6 py-4" style={{ borderBottom: '1px solid #E5DCC8' }}>
        <div className="max-w-full mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold" style={{ color: '#010D00' }}>
              TODO
            </h1>
            
            <div className="flex items-center gap-2">
              <HelpButton onClick={openTutorial} />
              <ExpandCollapseButton
                expandedCategories={expandedCategories}
                totalCategories={CATEGORIES.length}
                onToggleAll={toggleAllCategories}
              />
            </div>
          </div>
          
          {/* 날짜 네비게이션 */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => changeDate(-1)}
              className="p-2 rounded transition-colors"
              style={{ backgroundColor: 'transparent', color: '#736A5A' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F2E8D5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex flex-col items-center">
              <span className="text-lg font-medium" style={{ color: '#010D00' }}>
                {getDateDisplayText(selectedDate)}
              </span>
              <span className="text-sm mt-0.5" style={{ color: '#8C8270' }}>
                {totalTodos > 0 ? `${completedTodos}/${totalTodos}` : '일정 없음'}
              </span>
            </div>
            
            <button
              onClick={() => changeDate(1)}
              className="p-2 rounded transition-colors"
              style={{ backgroundColor: 'transparent', color: '#736A5A' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F2E8D5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* 돌아가기 버튼 */}
          {!isSameDay(selectedDate, getToday()) && (
            <button
              onClick={goToToday}
              className="w-full mt-3 py-2 text-sm rounded transition-colors flex items-center justify-center gap-2"
              style={{ backgroundColor: '#F2E8D5', color: '#736A5A' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E5DCC8'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F2E8D5'}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>돌아가기</span>
            </button>
          )}
        </div>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-full mx-auto px-6 py-6">
          {totalTodos === 0 && todos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64" style={{ color: '#8C8270' }}>
              <span className="text-4xl mb-2">📋</span>
              <span className="text-base">할 일을 추가해보세요</span>
            </div>
          ) : (
            <div className="space-y-4">
              {CATEGORIES.map(category => {
                const categoryTodos = getTodosByCategory(category.value);
                
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
          )}
        </div>
      </div>

      {/* 하단 입력창 */}
      <div className="p-4" style={{ borderTop: '1px solid #E5DCC8' }}>
        <div className="max-w-full mx-auto">
          <TextInput
            placeholder="할 일을 입력하세요..."
            maxLength={100}
            rows={1}
            onSubmit={async (text, dueDateInput, dueTime) => {
              try {
                setIsLoading(true);

                // 1) GPT 호출
                const response = await window.api.ai.gptAnalyzeTodo(text);

                if (!response.success || !response.data) {
                  showAlert("AI 분석 실패", "할 일을 분석할 수 없습니다.");
                  return;
                }

                // 2) GPT JSON 파싱
                const parsed = safeParseJSON(response.data);

                if (!parsed) {
                  showAlert("JSON 파싱 실패", "AI가 잘못된 JSON을 반환했습니다.");
                  return;
                }

                // 3) addTodo에 전체 객체 넘기기
                const manualDueDate = buildDueDateFromInput(dueDateInput, dueTime);

                await addTodo(parsed, manualDueDate);

              } catch (err) {
                console.error(err);
                showAlert("오류", "AI 분석 중 문제가 발생했습니다.");
              } finally {
                setIsLoading(false);
              }
            }}
            defaultDate={selectedDate}
          />
        </div>
      </div>

      {/* 모달들 */}
      <AlertModal
        isOpen={alertModal.isOpen}
        title={alertModal.title}
        message={alertModal.message}
        onConfirm={closeAlert}
      />
      <TutorialModal isOpen={showTutorial} onClose={closeTutorial} />
      <LoadingModal isOpen={isLoading} message="AI가 카테고리를 분석하는 중입니다..." />
    </div>
  );
}
