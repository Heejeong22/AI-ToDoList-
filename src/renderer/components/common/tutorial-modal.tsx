import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Keyboard, Sparkles, Bot } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TUTORIAL_STEPS = [
  {
    title: '단축키 사용',
    message: 'Ctrl+Shift+T (Mac: Cmd+Shift+T)를 눌러 앱을 빠르게 열고 닫을 수 있습니다.',
    icon: <Keyboard size={48} className="text-black dark:text-white" />,
    bg: 'bg-black/5 dark:bg-white/5'
  },
  {
    title: 'AI 자동 분석',
    message: '입력창에 할 일을 적기만 하세요. AI가 자동으로 카테고리를 분류해줍니다!',
    icon: <Bot size={48} className="text-black dark:text-white" />,
    bg: 'bg-black/5 dark:bg-white/5'
  },
  {
    title: '준비 완료!',
    message: 'AI Todo List와 함께 생산성을 높여보세요. 물음표(?)를 누르면 언제든 다시 볼 수 있습니다.',
    icon: <Sparkles size={48} className="text-black dark:text-white" />,
    bg: 'bg-black/5 dark:bg-white/5'
  },
];

export default function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep, onClose]);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />

          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative z-10 w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 shadow-xl border-1.2 border-black dark:border-transparent flex flex-col overflow-hidden font-sans"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors z-20 hover:bg-black/5 dark:hover:bg-white/10 p-1 rounded-full"
            >
              <X size={20} strokeWidth={2.5} />
            </button>

            {/* Content */}
            <div className="p-8 text-center flex-grow flex flex-col items-center justify-center pt-12">
              <motion.div
                key={currentStep}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className={`w-36 h-36 rounded-full ${currentTutorial.bg} flex items-center justify-center mb-8 shadow-inner border-1.2 border-border/50`}
              >
                {currentTutorial.icon}
              </motion.div>

              <motion.h2
                key={`title-${currentStep}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl font-bold text-text-primary mb-4 tracking-tight"
              >
                {currentTutorial.title}
              </motion.h2>

              <motion.p
                key={`desc-${currentStep}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-base text-text-secondary leading-relaxed font-medium"
              >
                {currentTutorial.message}
              </motion.p>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-border/50 bg-bg-secondary/50">
              {/* Dots */}
              <div className="flex justify-center gap-2 mb-6">
                {TUTORIAL_STEPS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`h-2 rounded-full transition-all duration-300 border border-black/20 dark:border-white/20 ${index === currentStep ? 'bg-black dark:bg-white w-8' : 'bg-transparent w-2'
                      }`}
                  />
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handlePrev}
                  disabled={isFirstStep}
                  className={`px-4 py-2 text-sm rounded-lg font-semibold flex items-center gap-2 transition-all border-1.2 border-transparent hover:border-black/50 hover:bg-black/5 dark:hover:bg-white/5 ${isFirstStep ? 'opacity-0 pointer-events-none' : 'text-text-secondary'
                    }`}
                >
                  <ArrowLeft size={16} strokeWidth={2.5} /> 이전
                </button>

                <button
                  onClick={isLastStep ? onClose : handleNext}
                  className="px-6 py-2.5 text-sm rounded-xl font-bold text-white bg-black dark:bg-white dark:text-black shadow-xl hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
                >
                  {isLastStep ? '시작하기' : '다음'}
                  {!isLastStep && <ArrowRight size={16} strokeWidth={2.5} />}
                </button>
              </div>
            </div>
          </motion.div >
        </div >
      )}
    </AnimatePresence >
  );
}