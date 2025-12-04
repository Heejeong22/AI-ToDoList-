import { useEffect } from 'react';

interface AlertModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
}

export default function AlertModal({
  isOpen,
  title = '알림',
  message,
  confirmText = '확인',
  onConfirm,
}: AlertModalProps) {
  // ESC 키 또는 Enter 키로 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        onConfirm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onConfirm]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onConfirm();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div
        className="rounded-lg shadow-2xl w-96 overflow-hidden"
        style={{
          backgroundColor: '#FEFDFB',
          border: '2px solid #E5DCC8',
        }}
      >
        {/* Header */}
        <div
          className="px-5 py-4"
          style={{
            borderBottom: '2px solid #E5DCC8',
            backgroundColor: '#F2E8D5',
          }}
        >
          <h3 className="text-lg font-bold" style={{ color: '#010D00' }}>
            {title}
          </h3>
        </div>

        {/* Content */}
        <div className="px-5 py-6" style={{ backgroundColor: '#FEFDFB' }}>
          <p className="text-base" style={{ color: '#4A3F35', lineHeight: '1.6' }}>
            {message}
          </p>
        </div>

        {/* Footer */}
        <div
          className="px-5 py-4 flex justify-center"
          style={{
            borderTop: '2px solid #E5DCC8',
          }}
        >
          <button
            onClick={onConfirm}
            className="px-8 py-2 text-sm rounded transition-colors font-bold"
            style={{
              backgroundColor: '#5D4E3E',
              color: '#FEFDFB',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4A3F35')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#5D4E3E')}
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}