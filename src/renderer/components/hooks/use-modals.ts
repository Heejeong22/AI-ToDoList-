import { useState, useEffect } from 'react';

export function useModals() {
  // 알림 모달
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
  });

  // 튜토리얼 모달
  const [showTutorial, setShowTutorial] = useState(false);

  // 첫 실행 시 튜토리얼 표시
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
      localStorage.setItem('hasSeenTutorial', 'true');
    }
  }, []);

  // 알림 표시 헬퍼
  const showAlert = (title: string, message: string) => {
    setAlertModal({
      isOpen: true,
      title,
      message,
    });
  };

  // 알림 닫기
  const closeAlert = () => {
    setAlertModal({ isOpen: false, title: '', message: '' });
  };

  // 튜토리얼 열기
  const openTutorial = () => {
    setShowTutorial(true);
  };

  // 튜토리얼 닫기
  const closeTutorial = () => {
    setShowTutorial(false);
  };

  return {
    alertModal,
    showAlert,
    closeAlert,
    showTutorial,
    openTutorial,
    closeTutorial,
  };
}