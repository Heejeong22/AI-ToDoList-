import { useState, useEffect } from 'react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TUTORIAL_STEPS = [
  {
    title: '단축키로 빠르게 접근',
    message: 'Ctrl+Shift+T (Mac: Cmd+Shift+T) 단축키를 눌러 언제든지 TODO 앱을 열고 닫을 수 있습니다.',
    icon: '⌨️',
  },
  {
    title: 'AI 자동 분류',
    message: '하단 입력창에 할 일을 입력하면 AI가 자동으로 카테고리를 분류해줍니다. 별도로 카테고리를 설정할 필요가 없습니다!',
    icon: '🤖',
  },
  {
    title: '즐거운 하루 되세요!',
    message: 'AI TODO 앱과 함께 생산적인 하루를 보내세요. 우측 상단의 ? 버튼을 눌러 언제든 다시 튜토리얼을 볼 수 있습니다.',
    icon: '✨',
  },
];

export default function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // 키보드 네비게이션 (화살표만)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep]);

  // 모달이 열릴 때마다 첫 번째 스텝으로 리셋
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentTutorial = TUTORIAL_STEPS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div
        className="rounded-lg shadow-2xl w-[500px] overflow-hidden"
        style={{
          backgroundColor: '#FEFDFB',
          border: '2px solid #E5DCC8',
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{
            borderBottom: '2px solid #E5DCC8',
            backgroundColor: '#F2E8D5',
          }}
        >
          <h3 className="text-lg font-bold" style={{ color: '#010D00' }}>
            AI TODO 앱 사용법
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-bg-hover transition-colors"
            style={{ color: '#736A5A' }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-8" style={{ backgroundColor: '#FEFDFB', minHeight: '250px' }}>
          <div className="flex flex-col items-center text-center">
            {/* 아이콘 */}
            <div className="text-6xl mb-6">
              {currentTutorial.icon}
            </div>

            {/* 제목 */}
            <h4 className="text-xl font-bold mb-4" style={{ color: '#010D00' }}>
              {currentTutorial.title}
            </h4>

            {/* 메시지 */}
            <p className="text-base leading-relaxed" style={{ color: '#4A3F35' }}>
              {currentTutorial.message}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4"
          style={{
            borderTop: '2px solid #E5DCC8',
          }}
        >
          {/* 진행 표시 점들 */}
          <div className="flex justify-center gap-2 mb-4">
            {TUTORIAL_STEPS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  backgroundColor: index === currentStep ? '#5D4E3E' : '#D4C4A8',
                }}
              />
            ))}
          </div>

          {/* 버튼들 */}
          <div className="flex justify-center items-center">
            {/* 좌우 네비게이션 */}
            <div className="flex gap-3">
              {/* 이전 버튼 */}
              <button
                onClick={handlePrev}
                disabled={isFirstStep}
                className="px-5 py-2 text-sm rounded transition-colors font-semibold flex items-center gap-2"
                style={{
                  backgroundColor: isFirstStep ? '#E5DCC8' : '#D4C4A8',
                  color: isFirstStep ? '#8C8270' : '#010D00',
                  cursor: isFirstStep ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (!isFirstStep) e.currentTarget.style.backgroundColor = '#C5B89A';
                }}
                onMouseLeave={(e) => {
                  if (!isFirstStep) e.currentTarget.style.backgroundColor = '#D4C4A8';
                }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                이전
              </button>

              {/* 다음/시작하기 버튼 */}
              <button
                onClick={isLastStep ? onClose : handleNext}
                className="px-5 py-2 text-sm rounded transition-colors font-bold flex items-center gap-2"
                style={{
                  backgroundColor: '#5D4E3E',
                  color: '#FEFDFB',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4A3F35')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#5D4E3E')}
              >
                {isLastStep ? '시작하기' : '다음'}
                {!isLastStep && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}