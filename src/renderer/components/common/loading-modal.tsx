interface LoadingModalProps {
  isOpen: boolean;
  message?: string;
}

export default function LoadingModal({ 
  isOpen, 
  message = '처리 중입니다...' 
}: LoadingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div
        className="rounded-lg shadow-2xl w-80 overflow-hidden"
        style={{
          backgroundColor: '#FEFDFB',
          border: '2px solid #E5DCC8',
        }}
      >
        {/* Content */}
        <div className="px-6 py-8 flex flex-col items-center" style={{ backgroundColor: '#FEFDFB' }}>
          {/* 로딩 스피너 */}
          <div className="relative w-16 h-16 mb-6">
            <div
              className="absolute inset-0 rounded-full animate-spin"
              style={{
                border: '4px solid #E5DCC8',
                borderTopColor: '#5D4E3E',
              }}
            />
          </div>

          {/* 메시지 */}
          <p className="text-base font-medium text-center" style={{ color: '#4A3F35' }}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}