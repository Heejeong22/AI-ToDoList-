import { useState } from 'react';
import { formatDate, getToday } from '../utils/date-utils';

interface DateTimePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: Date, time?: string) => void;
  initialDate?: Date;
  initialTime?: string;
}

export default function DateTimePicker({
  isOpen,
  onClose,
  onConfirm,
  initialDate,
  initialTime
}: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate || getToday());
  const [selectedTime, setSelectedTime] = useState<string>(initialTime || '');
  const [includeTime, setIncludeTime] = useState<boolean>(!!initialTime);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(selectedDate, includeTime ? selectedTime : undefined);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 빠른 선택 옵션
  const quickOptions = [
    { label: '오늘', getDays: () => 0 },
    { label: '내일', getDays: () => 1 },
    { label: '모레', getDays: () => 2 },
    { label: '다음주', getDays: () => 7 }
  ];

  const setQuickDate = (days: number) => {
    const newDate = new Date(getToday());
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  // 시간 옵션 생성 (30분 단위)
  const timeOptions: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute of [0, 30]) {
      const h = String(hour).padStart(2, '0');
      const m = String(minute).padStart(2, '0');
      timeOptions.push(`${h}:${m}`);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-80 max-h-[80vh] overflow-hidden">
        {/* header */}
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-800">날짜 및 시간 설정</h3>
        </div>

        {/* 내용 */}
        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* 빠른 선택 */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-2 block">빠른 선택</label>
            <div className="grid grid-cols-4 gap-2">
              {quickOptions.map(option => (
                <button
                  key={option.label}
                  onClick={() => setQuickDate(option.getDays())}
                  className="px-3 py-2 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 날짜 선택 */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-2 block">날짜</label>
            <input
              type="date"
              value={formatDate(selectedDate)}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* 시간 포함 토글 */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="includeTime"
              checked={includeTime}
              onChange={(e) => {
                setIncludeTime(e.target.checked);
                if (e.target.checked && !selectedTime) {
                  setSelectedTime('09:00');
                }
              }}
              className="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="includeTime" className="text-sm text-gray-700 cursor-pointer">
              시간 포함
            </label>
          </div>

          {/* 시간 선택 */}
          {includeTime && (
            <div>
              <label className="text-xs font-medium text-gray-600 mb-2 block">시간</label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {timeOptions.map(time => {
                  const [hour, minute] = time.split(':').map(Number);
                  const period = hour < 12 ? '오전' : '오후';
                  const displayHour = hour % 12 || 12;
                  const displayText = minute === 0 
                    ? `${period} ${displayHour}시`
                    : `${period} ${displayHour}시 ${minute}분`;
                  
                  return (
                    <option key={time} value={time}>
                      {displayText}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {/* 미리보기 */}
          <div className="bg-gray-50 rounded p-3">
            <div className="text-xs text-gray-500 mb-1">선택된 일정</div>
            <div className="text-sm font-medium text-gray-800">
              {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일
              {includeTime && selectedTime && (
                <>
                  {' • '}
                  {(() => {
                    const [hour, minute] = selectedTime.split(':').map(Number);
                    const period = hour < 12 ? '오전' : '오후';
                    const displayHour = hour % 12 || 12;
                    return minute === 0 
                      ? `${period} ${displayHour}시`
                      : `${period} ${displayHour}시 ${minute}분`;
                  })()}
                </>
              )}
            </div>
          </div>
        </div>

        {/* putter */}
        <div className="px-4 py-3 border-t border-gray-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}